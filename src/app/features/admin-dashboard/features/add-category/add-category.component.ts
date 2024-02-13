import {
  CategoryEditResponse,
  CategoryPayload,
  EditConfigResponse,
} from './../../../../types';
import {
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
import { BehaviorSubject, Observable, fromEvent, tap } from 'rxjs';
import {
  Attribute,
  AttributeOption,
  CategoryConfig,
  LoadingStatus,
} from '../../../../types';
import { selectAttributesState } from '../../../../store/category-management/attributes/attributes.reducers';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AttributeInputService } from '../../../../core/services/product/attribute-input.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { CustomCheckBoxComponent } from '../../../../shared/components/custom-check-box/custom-check-box.component';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { putBackAttributeOptionInStore } from '../../../../store/category-management/attributes/attributes.actions';
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
import { selectEditConfigState } from '../../../../store/category-management/attributes/config/config.reducers';
import { setLoadingSpinner } from '../../../../store/loader/actions/loader.actions';
import {
  convertAttributeOptionToCategoryConfig,
  convertToAttributeOption,
  convertToCategoryConfig,
  generateSizes,
  getConfigPayload,
  getNumberOfIncompatibles,
  isCategoryEditResponse,
  putInLocalAttributes,
  removeFromLocalAttributes,
  updateConfigPayload,
  updateConfigSizes,
} from '../../../../core/utils/helpers';
import { MatMenuModule } from '@angular/material/menu';
import { CustomSizeSelectionComponent } from '../../../../shared/components/custom-size-selection/custom-size-selection.component';

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
    CustomSelectComponent,
    AuthLoaderComponent,
    MatMenuModule,
    CustomSizeSelectionComponent,
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCategoryComponent implements OnInit, OnDestroy {
  private attributes$ = new BehaviorSubject<Attribute[]>([]);
  private selectedAttribute$ = new BehaviorSubject<AttributeOption[]>([]);
  attributes = this.attributes$.asObservable();
  selectedAttributes = this.selectedAttribute$.asObservable();

  categoryConfigPayload: Map<string, CategoryConfig[]> = new Map()

  loadingStatus!: Observable<LoadingStatus>;
  categoryForm!: FormGroup;
  localAttributes: Attribute[] = [];
  resize$!: Observable<Event>;
  isOverflow = false;
  makeLeftButtonGreen = true;
  makeRightButtonGreen = false;
  @ViewChild('contentWrapper') contentWrapper!: ElementRef<HTMLDivElement>;

  incompatibleSet: Record<string, AttributeOption[]> = {};
  numOfIncompatibles = 0;
  sizes: Record<string, string[]> = {};


  constructor(
    private store: Store,
    private attributeService: AttributeInputService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.resize$ = fromEvent(window, 'resize').pipe(
      tap(() => {
        this.isOverflow = this.isOverflown(this.contentWrapper.nativeElement);
      })
    );
    this.attributes = this.store.select(selectAttributesState).pipe(
      tap((attrs) => {
        this.localAttributes = attrs;
        this.categoryForm = this.attributeService.toFormGroup(attrs);
        this.categoryConfigPayload = getConfigPayload(this.localAttributes)      
        console.log('Category Config Payload', this.categoryConfigPayload);
      })
    );
    this.loadingStatus = this.store.select(selectLoaderState);
  }
  ngOnDestroy(): void {}



  createConfig() {
    let categoryConfig: CategoryConfig[] = []
    this.categoryConfigPayload.forEach((config) => {      
      categoryConfig = categoryConfig.concat(config)
    })
    
    const payload: CategoryPayload = {
      name: this.categoryForm.value['categoryName'],
      config: categoryConfig
    };    

    scrollTo({ top: 0, behavior: 'smooth' });
    if (this.categoryForm.invalid) {
      this.store.dispatch(
        setLoadingSpinner({
          isError: true,
          message: 'Please provide a category name',
          status: false,
        })
      );
      return;
    }
    this.store.dispatch(sendConfig(payload));
  }

  sizeSelection(event: MatAutocompleteSelectedEvent, attribute: Attribute) {
    const selectedSize = event.option.value as string;
    const correspondingAttributeOption: any =
      this.categoryForm.value[attribute.attributeName];
    const newBaseAmount = parseInt(selectedSize);
    if (isCategoryEditResponse(correspondingAttributeOption)) {
      this.categoryConfigPayload = updateConfigSizes(attribute.attributeName, correspondingAttributeOption.attributeOptionId, this.categoryConfigPayload, newBaseAmount)    
    } else {      
      this.categoryConfigPayload = updateConfigSizes(attribute.attributeName, correspondingAttributeOption.id, this.categoryConfigPayload, newBaseAmount)    
    }
  }

  removeFromPayload(categoryConfigPayload: Map<string, CategoryConfig[]>, attributeName: string, incompatibleAttributeOptions: AttributeOption[]) {
    const optionIds = incompatibleAttributeOptions.map((attributeOption) => attributeOption.id)
    const newConfig = categoryConfigPayload.get(attributeName)!.filter((categoryConfig) => !optionIds.includes(categoryConfig.attributeOptionId))
    const newCategoryConfigPayload = categoryConfigPayload.set(attributeName, newConfig)
    return newCategoryConfigPayload
  }

  addIncompatibleAttribute(categoryConfigPayload: Map<string, CategoryConfig[]>, attribute: Attribute, incompatibleAttributeOptions: AttributeOption[]) {    
    this.categoryConfigPayload = this.removeFromPayload(categoryConfigPayload, attribute.attributeName, incompatibleAttributeOptions)
    
    const {incompatibleSet, localAttributes} = this.buildIncompatibleTable(incompatibleAttributeOptions, this.incompatibleSet, this.localAttributes)
    this.incompatibleSet = incompatibleSet
    this.localAttributes = localAttributes
    this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet)
    
    // Clear involved form fields
    this.selectedAttribute$.next([]);
    this.categoryForm.patchValue({ attributesInput: '', variants: '' });
    
  }

  onSelectConfigOptions(event: MatSelectChange, attribute: Attribute){
    const selectedAttributeOption = event.value as AttributeOption; 
    if (attribute.isMeasured) {
      this.sizes[attribute.attributeName] = generateSizes(
        selectedAttributeOption.additionalInfo.baseAmount,
        selectedAttributeOption.additionalInfo.maxAmount,
        attribute.unit
      );
    }
    this.categoryConfigPayload = updateConfigPayload(selectedAttributeOption.id, selectedAttributeOption.attribute.id, selectedAttributeOption.attribute.name, this.categoryConfigPayload)
  }

  removeAttributeOption(attributeOption: AttributeOption, options: AttributeOption[]) {
    const newAttributeOptions = options.filter((option) => option.id !== attributeOption.id)
    if (newAttributeOptions.length === 0) {
      delete this.incompatibleSet[attributeOption.attribute.name]
    } else {
      this.incompatibleSet[attributeOption.attribute.name] = newAttributeOptions
    }
    this.localAttributes = putInLocalAttributes(this.localAttributes, attributeOption)
    this.categoryConfigPayload = getConfigPayload(this.localAttributes)
    this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet)
  }

  buildIncompatibleTable(incompatibleAttributeOptions: AttributeOption[], currentIncompatibleSet: Record<string, AttributeOption[]>, localAttributes: Attribute[]) {
    const incompatibleSet: Record<string, AttributeOption[]> = currentIncompatibleSet
    incompatibleAttributeOptions.forEach((incompatibleAttribute) => {
      if (incompatibleSet[incompatibleAttribute.attribute.name]) {
        incompatibleSet[incompatibleAttribute.attribute.name].push(
          incompatibleAttribute
        );
      } else {
        incompatibleSet[incompatibleAttribute.attribute.name] = [
          incompatibleAttribute,
        ];
      }
      localAttributes = removeFromLocalAttributes(
        localAttributes,
        incompatibleAttribute.id
      );
    });

    return {incompatibleSet, localAttributes}
  }

  onSelectChange(event: MatSelectChange) {
    this.selectedAttribute$.next(event.value.attributeOptions);
  }

  isOverflown(element: HTMLElement) {
    return element.scrollWidth > element.clientWidth;
  }
  onFocus(control: AbstractControl) {
    const value = control.value
    control.reset()
    control.patchValue(value)
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

  get variants() {
    return this.categoryForm.get('variants')!;
  }
}
