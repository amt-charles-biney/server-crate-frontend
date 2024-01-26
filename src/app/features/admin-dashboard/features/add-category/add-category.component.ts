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
import {
  Attribute,
  AttributeOption,
  CategoryAndConfig,
  CategoryConfig,
  LoadingStatus,
} from '../../../../types';
import { selectAttributesState } from '../../../../store/category-management/attributes/attributes.reducers';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import {
  getSingleCategoryAndConfig,
  resetEditState,
  sendConfig,
  sendEditedConfig,
} from '../../../../store/category-management/attributes/config/config.actions';
import { AuthLoaderComponent } from '../../../../shared/components/auth-loader/auth-loader.component';
import { selectLoaderState } from '../../../../store/loader/reducers/loader.reducers';
import { ActivatedRoute, Router } from '@angular/router';
import {
  selectEditConfigState,
  selectName,
} from '../../../../store/category-management/attributes/config/config.reducers';
import { tap } from 'lodash';

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
    AuthLoaderComponent,
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCategoryComponent implements OnInit, AfterViewInit, OnDestroy {
  private attributes$ = new BehaviorSubject<Attribute[]>([]);
  private selectedAttribute$ = new BehaviorSubject<AttributeOption[]>([]);
  loadingStatus!: Observable<LoadingStatus>;
  selectedAttributes = this.selectedAttribute$.asObservable();
  attributes = this.attributes$.asObservable();
  categoryForm!: FormGroup;
  localAttributes!: Attribute[];
  makeLeftButtonGreen = true;
  makeRightButtonGreen = false;
  isOverflow = false;
  categoryConfig: CategoryConfig[] = [];
  categoryConfigSet: Record<string, CategoryConfig> = {};
  sizes: Record<string, string[]> = {};
  id!: string | null;
  @ViewChild('contentWrapper') contentWrapper!: ElementRef<HTMLDivElement>;
  incompatibleAttributes: Record<string, Set<AttributeOption>> = {};
  formValue!: Record<string, string>;
  constructor(
    private store: Store,
    private attributeService: AttributeInputService,
    private destroyRef: DestroyRef,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.attributes = this.store.select(selectAttributesState);
    this.attributes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((attrs) => {
        this.localAttributes = attrs;
      });
    if (this.id) {
      this.store.dispatch(getSingleCategoryAndConfig({ id: this.id }));
      this.store
        .select(selectEditConfigState)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((configuration) => {
          const { config, id, name, incompatible } = configuration;
          let values: Record<string, string> = {
            categoryName: name,
            StorageSize: '400',
            MemorySize: '600',
            attributesInput: '',
            variants: '',
          };
          config.forEach((configItem) => {
            if (configItem.isIncluded) {
              values[configItem.type] = configItem.name;
            }
            if (configItem.isMeasured) {
              values[`${configItem.type}Size`] = configItem.baseAmount.toString();
                this.sizes[configItem.type] = this.generateSizes(
                  configItem.baseAmount,
                  configItem.maxAmount,
                  configItem.unit
                );
            }
            if (incompatible[configItem.type]) {
              incompatible[configItem.type].forEach((incompatibleType) => {
                console.log('incompatible type', incompatibleType);                
                this.localAttributes = this.removeFromLocalAttributes(
                  this.localAttributes,
                  incompatibleType
                );
              });
            }
          });
          
          if (Object.values(values).length > 0) {
            this.categoryForm = this.attributeService.editFormGroup(values);
            this.categoryForm.setValue({ ...values });
          }
          this.incompatibleAttributes = incompatible;
          console.log('Form', values);
        });
    } else {
      this.attributes
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((attrs) => {
          this.categoryForm = this.attributeService.toFormGroup(attrs);

          if (this.formValue) {
            console.log('Here');

            this.categoryForm = this.attributeService.editFormGroup(
              this.formValue
            );
          }
        });
    }

    this.loadingStatus = this.store.select(selectLoaderState);
  }

  ngAfterViewInit(): void {
    console.log('Content wrapper', this.contentWrapper.nativeElement);
  }

  ngOnDestroy(): void {
    this.store.dispatch(getAttributes());
    this.store.dispatch(resetEditState());
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
    incompatibleAttributesParam: Record<string, Set<AttributeOption>>
  ) {    
    let incompatibleAttributes = incompatibleAttributesParam
    const name = option.attribute.name;
    console.log('IncomaptibleAttributes', incompatibleAttributes);
    if (Array.isArray(incompatibleAttributes[name])) {
      console.log('Array');
      incompatibleAttributes = {[name]: new Set(incompatibleAttributes[name])}
      console.log('IncomaptibleAttributesSet', incompatibleAttributes);
    }
    
    let remainingAttributeOptions = incompatibleAttributes[name].delete(option);
    this.store.dispatch(putBackAttributeOptionInStore(option));
    if (incompatibleAttributes[name].size === 0) {
      delete incompatibleAttributes[name];
    }
    console.log(this.incompatibleAttributes);
    this.categoryConfigSet = {};
    return remainingAttributeOptions;
  }

  removeFromLocalAttributes(
    localAttributes: Attribute[],
    option: AttributeOption
  ) {
    let newLocalAttributes: Attribute[] = [];
    newLocalAttributes = localAttributes?.map((attribute) => {
      let newLocalAttributeOptions: AttributeOption[] = [];
      attribute.attributeOptions.forEach((attributeOption) => {
        if (attributeOption.optionName !== option.optionName) {
          newLocalAttributeOptions.push(attributeOption);
        }
      });
      return { ...attribute, attributeOptions: newLocalAttributeOptions };
    });
    return newLocalAttributes;
  }

  addIncompatibleAttribute() {
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
        incompatibleSet[incompatibleAttribute.attribute.name].add(
          incompatibleAttribute
        );
      } else {
        incompatibleSet[incompatibleAttribute.attribute.name] = new Set([
          incompatibleAttribute,
        ]);
      }
      this.formValue = this.categoryForm.value;
      this.store.dispatch(removeAttributeOptionInStore(incompatibleAttribute));
    });
    return incompatibleSet;
  }

  createConfig() {
    for (let attributeName in this.sizes) {
      const optionName =
        this.categoryForm.controls[attributeName].value.optionName;
      const newBaseAmount = parseInt(
        this.categoryForm.value[`${attributeName}Size`]
      );
      if (this.categoryConfigSet[optionName] && !isNaN(newBaseAmount)) {
        this.categoryConfigSet[optionName].baseAmount = newBaseAmount;
      }
    }
    const payload = {
      name: this.categoryForm.value['categoryName'],
      config: Array.from(Object.values(this.categoryConfigSet)).concat(
        this.convertIncompatiblesToCategoryConfig(this.incompatibleAttributes)
      ),
    };
    console.log('Sending payload', payload);
    console.log('Incompatible attributes', this.incompatibleAttributes);
    console.log(
      this.convertIncompatiblesToCategoryConfig(this.incompatibleAttributes)
    );
    scrollTo({ top: 0, behavior: 'smooth' });
    if (this.id) {
      const editPayload = {
        ...payload,
        id: this.id
      }
      this.store.dispatch(sendEditedConfig({ configuration: editPayload, id: this.id }))
    } else {
      this.store.dispatch(sendConfig(payload));
    }
  }

  convertIncompatiblesToCategoryConfig(
    incompatibleAttributes: Record<string, Set<AttributeOption>>
  ) {
    let categoryConfigList: CategoryConfig[] = [];
    for (let key in incompatibleAttributes) {
      const incompatibleAttribute = incompatibleAttributes[key];
      incompatibleAttribute.forEach((attribute) => {
        const categoryConfig: CategoryConfig = {
          baseAmount: attribute.additionalInfo.baseAmount,
          maxAmount: attribute.additionalInfo.maxAmount,
          priceFactor: attribute.additionalInfo.priceFactor,
          isCompatible: false,
          isIncluded: false,
          isMeasured: attribute.attribute.isMeasured,
          media: attribute.optionMedia,
          name: attribute.optionName,
          type: attribute.attribute.name,
          price: attribute.optionPrice,
          unit: attribute.attribute.unit,
          id: attribute.id
        };
        categoryConfigList.push(categoryConfig);
      });
    }
    return categoryConfigList;
  }

  onSelectConfigOptions(event: MatSelectChange, attribute: Attribute) {
    const includedAttributeOption = event.value as AttributeOption;
    console.log('Included Attribute', includedAttributeOption);
    
    if (attribute.isMeasured) {
      this.sizes[attribute.attributeName] = this.generateSizes(
        includedAttributeOption.additionalInfo.baseAmount,
        includedAttributeOption.additionalInfo.maxAmount,
        attribute.unit
      );
    }
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
      id: includedAttributeOption.id
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
              id: attributeOption.id
            };
            restOfConfig.push(config);

            this.categoryConfigSet[attributeOption.optionName] = config;
          }
        });
      }
    });
    this.categoryConfig.push(configOption, ...restOfConfig);
  }

  generateSizes(baseAmount: number, maxAmount: number, unit: string) {
    const sizes: string[] = [];
    for (let size = baseAmount; size <= maxAmount; size = size + baseAmount) {
      sizes.push(`${size} ${unit}`);
    }
    return sizes;
  }

  getConfigId(name: string, type: string, config: CategoryConfig[]) {

  }

  cancel() {
    this.router.navigateByUrl('/admin/category-management');
  }
  get attributesInput() {
    return this.categoryForm.get('attributesInput')!;
  }

  get categoryName() {
    return this.categoryForm.get('categoryName')!;
  }
}
