import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { Attribute, AttributeOption, CategoryConfig, LoadingStatus } from '../../../../types';
import { selectAttributesState } from '../../../../store/category-management/attributes/attributes.reducers';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AttributeInputService } from '../../../../core/services/product/attribute-input.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CustomCheckBoxComponent } from '../../../../shared/components/custom-check-box/custom-check-box.component';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  getAttributes,
  putBackAttributeOptionInStore,
  removeAttributeOptionInStore,
} from '../../../../store/category-management/attributes/attributes.actions';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select.component';
import { Router } from '@angular/router';
import { sendConfig } from '../../../../store/category-management/attributes/config/config.actions';
import { AuthLoaderComponent } from '../../../../shared/components/auth-loader/auth-loader.component';
import { selectLoaderState } from '../../../../store/loader/reducers/loader.reducers';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [
    CustomInputComponent,
    CommonModule,
    CustomInputComponent,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    CustomCheckBoxComponent,
    MatSelectModule,
    MatFormFieldModule,
    CustomSelectComponent,
    AuthLoaderComponent
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCategoryComponent implements OnInit, AfterViewInit, OnDestroy {
  private attributes$ = new BehaviorSubject<Attribute[]>([]);
  private selectedAttribute$ = new BehaviorSubject<AttributeOption[]>([]);
  loadingStatus!: Observable<LoadingStatus>
  selectedAttributes = this.selectedAttribute$.asObservable();
  attributes = this.attributes$.asObservable();
  categoryForm!: FormGroup;
  localAttributes!: Attribute[];
  makeLeftButtonGreen = true;
  makeRightButtonGreen = false;
  isOverflow = false;
  categoryConfig: CategoryConfig[] = [];
  categoryConfigSet: Record<string, CategoryConfig> = {};
  @ViewChild('contentWrapper') contentWrapper!: ElementRef<HTMLDivElement>;
  incompatibleAttributes: Record<string, Set<AttributeOption>> = {};
  formValue: any
  constructor(
    private store: Store,
    private attributeService: AttributeInputService,
    private destroyRef: DestroyRef,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.attributes = this.store.select(selectAttributesState)
    this.attributes
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((attrs) => {
        this.categoryForm = this.attributeService.toFormGroup(attrs);
        if (this.formValue) {
          this.categoryForm = this.attributeService.editFormGroup(this.formValue)
        }
        this.localAttributes = attrs;
      });
    this.loadingStatus = this.store.select(selectLoaderState)
  }

  ngAfterViewInit(): void {
    console.log('Content wrapper', this.contentWrapper.nativeElement);
  }

  ngOnDestroy(): void {
    this.store.dispatch(getAttributes());
  }

  sideScroll(
    element: HTMLDivElement,
    speed: number,
    distance: number,
    step: number
  ) {
    let scrollAmount = 0;

    const slideTimer = setInterval(() => {
      element.scrollLeft += step;
      scrollAmount += Math.abs(step);
      if (scrollAmount >= distance) {
        clearInterval(slideTimer);
      }
    }, speed);
    // Finished scrolling right
    if (element.scrollLeft + element.offsetWidth + 2 >= element.scrollWidth) {
      this.makeLeftButtonGreen = false;
    } else {
      this.makeLeftButtonGreen = true;
    }
    // Finished scrolling right
    if (element.scrollLeft > 0) {
      this.makeRightButtonGreen = true;
    } else {
      this.makeRightButtonGreen = false;
    }
    console.log(
      'scrollwidth',
      element.scrollWidth,
      'scrollLeft',
      element.scrollLeft,
      'offsetWidth',
      element.offsetWidth
    );
  }

  onSelectChange(event: MatSelectChange) {
    this.selectedAttribute$.next(event.value.attributeOptions);
  }

  isOverflown(element: HTMLElement) {
    return element.scrollWidth > element.clientWidth;
  }
  removeAttributeOption(
    option: AttributeOption,
    incompatibleAttributes: Record<string, Set<AttributeOption>>
  ) {
    const name = option.attribute.name;
    let remainingAttributeOptions = incompatibleAttributes[name].delete(option);
    this.store.dispatch(putBackAttributeOptionInStore(option));
    if (incompatibleAttributes[name].size === 0) {
      delete incompatibleAttributes[name];
    }
    console.log(this.incompatibleAttributes);
    this.categoryConfigSet = {};
    return remainingAttributeOptions;
  }

  addAttribute() {
    const element = this.contentWrapper.nativeElement;
    const attribute = this.categoryForm.get('variants')
      ?.value as AttributeOption[];
    this.incompatibleAttributes = {
      ...this.incompatibleAttributes,
      ...this.buildIncompatibleTable(attribute),
    };
    this.isOverflow = !(element.scrollWidth === element.offsetWidth);
    console.log(this.isOverflow, 'client');
    if (
      element.offsetHeight < element.scrollHeight ||
      element.offsetWidth < element.scrollWidth
    ) {
      console.log('OVERFLOW');
    }
    console.log(this.isOverflown(this.contentWrapper.nativeElement));
    this.categoryConfigSet = {};
    this.selectedAttribute$.next([]);
  }
  buildIncompatibleTable(
    incompatibles: AttributeOption[]
  ): Record<string, Set<AttributeOption>> {
    const incompatibleSet: Record<string, Set<AttributeOption>> = {};
    incompatibles.forEach((incompatibleAttribute) => {
      if (incompatibleSet[incompatibleAttribute.attribute.name]) {
        console.log('Already there', incompatibleSet[incompatibleAttribute.attribute.name]);
        console.log('prev', incompatibleSet[incompatibleAttribute.attribute.name]);
        
        incompatibleSet[incompatibleAttribute.attribute.name].add(
          incompatibleAttribute
        );
        console.log('after', incompatibleSet[incompatibleAttribute.attribute.name]);
        
      } else {
        console.log('after', incompatibleSet[incompatibleAttribute.attribute.name]);
        incompatibleSet[incompatibleAttribute.attribute.name] = new Set([
          incompatibleAttribute,
        ]);
      }
      this.formValue = this.categoryForm.value
      this.store.dispatch(removeAttributeOptionInStore(incompatibleAttribute));      
    });
    return incompatibleSet;
  }

  createConfig() {
    const payload = {
      name: this.categoryForm.value['categoryName'],
      config: Array.from(Object.values(this.categoryConfigSet)),
    };
    console.log('Sending payload', payload);
    this.store.dispatch(sendConfig(payload))
  }

  onSelectConfigOptions(event: MatSelectChange, attribute: Attribute) {
    const includedAttributeOption = event.value as AttributeOption;
    console.log(attribute);

    const configOption: CategoryConfig = {
      name: includedAttributeOption.optionName,
      type: includedAttributeOption.attribute.name,
      price: includedAttributeOption.optionPrice,
      media: includedAttributeOption.optionMedia,
      isCompatible: true,
      unit: attribute.unit,
      isIncluded: true,
      isMeasured: includedAttributeOption.attribute.isMeasured,
      baseAmount: includedAttributeOption.additionalInfo.baseAmount,
      priceFactor: includedAttributeOption.additionalInfo.priceFactor,
      maxAmount: includedAttributeOption.additionalInfo.maxAmount,
    };

    this.categoryConfigSet[configOption.name] = configOption;

    let restOfConfig: CategoryConfig[] = [];

    this.localAttributes.forEach((attr) => {
      if (attr.id === includedAttributeOption.attribute.id) {
        attr.attributeOptions.forEach((attributeOption) => {
          if (includedAttributeOption.id !== attributeOption.id) {
            const config: CategoryConfig = {
              name: attributeOption.optionName,
              type: attributeOption.attribute.name,
              price: attributeOption.optionPrice,
              media: attributeOption.optionMedia,
              unit: attr.unit,
              isCompatible: true,
              isIncluded: false,
              isMeasured: attributeOption.attribute.isMeasured,
              baseAmount: attributeOption.additionalInfo.baseAmount,
              maxAmount: attributeOption.additionalInfo.maxAmount,
              priceFactor: attributeOption.additionalInfo.priceFactor,
            };
            restOfConfig.push(config);

            this.categoryConfigSet[attributeOption.optionName] = config;
          }
        });
      }
    });
    this.categoryConfig.push(configOption, ...restOfConfig);
    console.log('Category Config', this.categoryConfig);
    console.log('Set', this.categoryConfigSet);
  }
  get attributesInput() {
    return this.categoryForm.get('attributesInput')!;
  }

  get categoryName() {
    return this.categoryForm.get('categoryName')!
  }
}
