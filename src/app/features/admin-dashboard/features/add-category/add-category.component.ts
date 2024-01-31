import {
  CategoryEdit,
  CategoryEditResponse,
  CategoryPayload,
  EditConfig,
  EditConfigResponse,
} from './../../../../types';
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
import { BehaviorSubject, Observable, debounceTime, fromEvent, tap } from 'rxjs';
import {
  Attribute,
  AttributeOption,
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
import { selectEditConfigState } from '../../../../store/category-management/attributes/config/config.reducers';
import { setLoadingSpinner } from '../../../../store/loader/actions/loader.actions';
import {
  convertToAttributeOption,
  convertToCategoryConfig,
  getAttributeOptionList,
  isAttributeOption,
} from '../../../../core/utils/helpers';
import { MatMenuModule } from '@angular/material/menu';

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
    MatMenuModule,
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCategoryComponent implements OnInit, OnDestroy {
  private attributes$ = new BehaviorSubject<Attribute[]>([]);
  private selectedAttribute$ = new BehaviorSubject<AttributeOption[]>([]);
  loadingStatus!: Observable<LoadingStatus>;
  selectedAttributes = this.selectedAttribute$.asObservable();
  attributes = this.attributes$.asObservable();
  categoryForm!: FormGroup;
  localAttributes: Attribute[] = [];
  localAttributesForEdit: CategoryEdit[] = [];
  makeLeftButtonGreen = true;
  makeRightButtonGreen = false;
  isOverflow = false;
  categoryConfig: CategoryConfig[] = [];
  categoryConfigSet: Record<string, CategoryConfig> = {};
  incompatibleSet: Record<string, AttributeOption[]> = {};
  sizes: Record<string, string[]> = {};
  id!: string | null;
  @ViewChild('contentWrapper') contentWrapper!: ElementRef<HTMLDivElement>;
  formValue!: Record<string, string>;
  formAttributes!: Record<string, string>;
  resize$!: Observable<Event>
  constructor(
    private store: Store,
    private attributeService: AttributeInputService,
    private destroyRef: DestroyRef,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.resize$ = fromEvent(window, 'resize').pipe(
      tap(() => {
        this.isOverflow = this.isOverflown(this.contentWrapper.nativeElement)
      }),
    )
    this.attributes = this.store.select(selectAttributesState).pipe(
      tap((attrs) => {
        this.localAttributes = attrs;
        this.categoryForm = this.attributeService.toFormGroup(attrs);
        //Prevents the form losing data when a new attribute is added to incompatible pile
        if (this.formValue) {
          this.categoryForm.patchValue({ ...this.formValue });
        }
        if (this.id) {
          this.store.dispatch(getSingleCategoryAndConfig({ id: this.id }));

          this.store
            .select(selectEditConfigState)
            .pipe(
              tap((editConfig: EditConfigResponse) => {
                const { config, name } = editConfig;
                this.incompatibleSet = this.generateIncompatiblesTable(config);
                const editFormValues = this.attributeService.editFormGroup(
                  config,
                  name
                ).value;
                
                config.forEach((categoryConfig) => {
                  if (categoryConfig.isMeasured && categoryConfig.isIncluded) {
                    this.sizes[categoryConfig.type] = this.generateSizes(
                      categoryConfig.baseAmount,
                      categoryConfig.maxAmount,
                      categoryConfig.unit
                    );
                  }
                  if (!categoryConfig.isCompatible) {
                    this.localAttributes = this.removeFromLocalAttributes(
                      this.localAttributes,
                      categoryConfig.attributeOptionId
                    );
                  }
                  if (categoryConfig.isIncluded) {
                    this.categoryConfigSet[categoryConfig.name] = convertToCategoryConfig(categoryConfig)
                  }
                });
                this.categoryForm.patchValue({ ...editFormValues });
              }),
              takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
        }
      })
    );
    this.loadingStatus = this.store.select(selectLoaderState);
  }

  ngOnDestroy(): void {
    this.store.dispatch(getAttributes());
    this.store.dispatch(resetEditState());
  }
  removeFromLocalAttributes(localAttributes: Attribute[], optionId: string) {
    let newLocalAttributes: Attribute[] = [];
    newLocalAttributes = localAttributes?.map((attribute) => {
      let newLocalAttributeOptions: AttributeOption[] =
        attribute.attributeOptions.filter(
          (attributeOption) => attributeOption.id !== optionId
        );
      return { ...attribute, attributeOptions: newLocalAttributeOptions };
    });
    return newLocalAttributes;
  }
  putInLocalAttributes(localAttributes: Attribute[], newOption: AttributeOption) {
    let newLocalAttributes: Attribute[] = [];
    newLocalAttributes = localAttributes?.map((attribute) => {
      let newLocalAttributeOptions: AttributeOption[] = []
      if (attribute.id === newOption.attribute.id) {
        newLocalAttributeOptions = [...attribute.attributeOptions, newOption];
        return { ...attribute, attributeOptions: newLocalAttributeOptions };
      }
      return attribute
    });
    return newLocalAttributes;
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

  onSelectChange(event: MatSelectChange) {
    this.selectedAttribute$.next(event.value.attributeOptions);
  }

  isOverflown(element: HTMLElement) {
    return element.scrollWidth > element.clientWidth;
  }
  removeAttributeOption(option: AttributeOption) {
    const name = option.attribute.name;
    this.incompatibleSet[name] = this.incompatibleSet[name].filter(
      (opt) => option.id !== opt.id
    );
    if (!this.id) {
      this.store.dispatch(putBackAttributeOptionInStore(option));
    } else {
      this.localAttributes = this.putInLocalAttributes(this.localAttributes, option)
    }
    if (this.incompatibleSet[name].length === 0) {
      delete this.incompatibleSet[name];
    }
    // this.categoryConfigSet = {};
    this.categoryConfigSet[option.optionName] = {
      attributeId: option.attribute.id,
      attributeName: option.attribute.name,
      attributeOptionId: option.id,
      isCompatible: true,
      isIncluded: false,
      isMeasured: option.attribute.isMeasured,
      size: option.additionalInfo.baseAmount,
    };
    // dispatching to store refreshes the form, the ff line puts back the selected values
    this.categoryForm.patchValue({
      attributesInput: '',
      variants: '',
      [option.attribute.name]: this.id ? '' : option.optionName,
    });
  }

  addIncompatibleAttribute() {
    const incompatibleAttributes = this.categoryForm.get('variants')
      ?.value as AttributeOption[];
    if (incompatibleAttributes.length === 0) {
      return;
    }
    const element = this.contentWrapper.nativeElement;
    // If Windows 10 for eg, is made incompatible, remove all OS attributeOptions

    incompatibleAttributes.forEach((incompatibleAttribute) => {
      if (incompatibleAttribute.attribute.isMeasured) {
        this.sizes[incompatibleAttribute.attribute.name] = [];
      }
      if (this.categoryConfigSet[incompatibleAttribute.optionName]) {
        if (
          this.categoryConfigSet[incompatibleAttribute.optionName]
            .attributeName === incompatibleAttribute.attribute.name
        ) {
          delete this.categoryConfigSet[incompatibleAttribute.optionName];
        }
      }
    });
    this.buildIncompatibleTable(incompatibleAttributes);
    this.isOverflow = this.isOverflown(element)
    if (
      element.offsetHeight < element.scrollHeight ||
      element.offsetWidth < element.scrollWidth
    ) {
    }
    this.selectedAttribute$.next([]);
    this.categoryForm.patchValue({ attributesInput: '', variants: '' });
  }

  generateIncompatiblesTable(config: CategoryEditResponse[]) {
    const newIncompatibleSet: Record<string, AttributeOption[]> = {};
    config.forEach((categoryAttribute) => {
      if (!categoryAttribute.isCompatible) {
        if (newIncompatibleSet[categoryAttribute.type]) {
          newIncompatibleSet[categoryAttribute.type].push(
            convertToAttributeOption(
              categoryAttribute,
              categoryAttribute.attributeId,
              categoryAttribute.attributeOptionId
            )
          );
        } else {
          newIncompatibleSet[categoryAttribute.type] = [
            convertToAttributeOption(
              categoryAttribute,
              categoryAttribute.attributeId,
              categoryAttribute.attributeOptionId
            ),
          ];
        }
      }
    });
    return newIncompatibleSet;
  }

  buildIncompatibleTable(incompatibles: AttributeOption[]) {
    incompatibles.forEach((incompatibleAttribute) => {
      if (this.incompatibleSet[incompatibleAttribute.attribute.name]) {
        this.incompatibleSet[incompatibleAttribute.attribute.name].push(
          incompatibleAttribute
        );
      } else {
        this.incompatibleSet[incompatibleAttribute.attribute.name] = [
          incompatibleAttribute,
        ];
      }
      this.formValue = this.categoryForm.value;
      // this.store.dispatch(
      //   removeAttributeOptionInStore({
      //     attributeId: incompatibleAttribute.attribute.id,
      //     optionId: incompatibleAttribute.id,
      //   })
      // );
      this.localAttributes = this.removeFromLocalAttributes(
        this.localAttributes,
        incompatibleAttribute.id
      );
    });
  }

  createConfig() {    
    const payload: CategoryPayload = {
      name: this.categoryForm.value['categoryName'],
      config: Array.from(
        Object.values(this.categoryConfigSet).concat(
          this.convertIncompatiblesToCategoryConfig(this.incompatibleSet)
        )
      ),
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

    if (this.id) {      
      const editPayload = {
        ...payload,
        id: this.id,
      };      

      this.store.dispatch(
        sendEditedConfig({ configuration: editPayload, id: this.id })
      );
    } else {      
      this.store.dispatch(sendConfig(payload));
    }
  }

  convertIncompatiblesToCategoryConfig(
    incompatibleAttributes: Record<string, AttributeOption[]>
  ) {
    let categoryConfigList: CategoryConfig[] = [];
    for (let key in incompatibleAttributes) {
      const incompatibleAttribute = incompatibleAttributes[key];
      incompatibleAttribute.forEach((attribute) => {
        const categoryConfig: CategoryConfig = {
          size: attribute.additionalInfo.baseAmount,
          isCompatible: false,
          isIncluded: false,
          isMeasured: attribute.attribute.isMeasured,
          attributeId: attribute.id,
          attributeName: attribute.attribute.name,
          attributeOptionId: attribute.id,
        };
        categoryConfigList.push(categoryConfig);
      });
    }
    return categoryConfigList;
  }

  sizeSelection(event: MatSelectChange, attribute: Attribute) {
    const selectedSize = event.value as string;
    const correspondingAttributeOption: CategoryEditResponse =
      this.categoryForm.value[attribute.attributeName];
    
    const newBaseAmount = parseInt(selectedSize);
    this.categoryConfigSet[correspondingAttributeOption.name].size =
      newBaseAmount;
  }
  onSelectConfigOptions(event: MatSelectChange, attribute: Attribute) {
    const selectedAttributeOption = event.value as AttributeOption;    
    if (attribute.isMeasured) {
      this.sizes[attribute.attributeName] = this.generateSizes(
        selectedAttributeOption.additionalInfo.baseAmount,
        selectedAttributeOption.additionalInfo.maxAmount,
        attribute.unit
      );
    }
    const configOption: CategoryConfig = {
      attributeId: attribute.id,
      attributeOptionId: selectedAttributeOption.id,
      isCompatible: true,
      isIncluded: true,
      isMeasured: attribute.isMeasured,
      size: selectedAttributeOption.additionalInfo.baseAmount,
      attributeName: attribute.attributeName,
    };

    this.categoryConfigSet[selectedAttributeOption.optionName] = configOption;

    let restOfConfig: CategoryConfig[] = [];

    this.localAttributes.forEach((attr) => {
      if (attr.id === selectedAttributeOption.attribute.id) {
        attr.attributeOptions.forEach((attributeOption) => {
          if (selectedAttributeOption.id !== attributeOption.id) {
            const config: CategoryConfig = {
              isCompatible: true,
              isIncluded: false,
              isMeasured: attributeOption.attribute.isMeasured,
              size: attributeOption.additionalInfo.baseAmount,
              attributeOptionId: attributeOption.id,
              attributeId: attributeOption.attribute.id,
              attributeName: attributeOption.attribute.name,
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
