import {
  Case,
  CategoryEditResponse,
  CategoryPayload,
  EditConfigResponse,
  CategoryConfig,
  Attribute,
  AttributeOption,
  LoadingStatus,
} from './../../../../types';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select.component';
import {
  getSingleCategoryAndConfig,
  resetEditState,
  resetImage,
  sendConfig,
  sendEditedConfig,
  uploadCoverImage,
} from '../../../../store/category-management/attributes/config/config.actions';
import { AuthLoaderComponent } from '../../../../shared/components/auth-loader/auth-loader.component';
import { selectLoaderState } from '../../../../store/loader/reducers/loader.reducers';
import { ActivatedRoute, Router } from '@angular/router';
import {
  selectCategoryImageState,
  selectEditConfigState,
} from '../../../../store/category-management/attributes/config/config.reducers';
import {
  buildIncompatibleTable,
  generateIncompatiblesTable,
  generateSizes,
  getNumberOfIncompatibles,
  isAttributeOption,
  isCategoryEditResponse,
  putInLocalAttributes,
  removeFromLocalAttributes,
} from '../../../../core/utils/helpers';
import { MatMenuModule } from '@angular/material/menu';
import { CustomSizeSelectionComponent } from '../../../../shared/components/custom-size-selection/custom-size-selection.component';
import { IncompatiblesComponent } from '../../../../shared/components/incompatibles/incompatibles.component';
import { LoaderComponent } from '../../../../core/components/loader/loader.component';
import { ErrorComponent } from '../../../../shared/components/error/error.component';
import { CustomImageComponent } from '../../../../shared/components/custom-image/custom-image.component';
import { CLOUD_NAME, UPLOAD_PRESET } from '../../../../core/utils/constants';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getCases } from '../../../../store/case/case.actions';
import { selectCases } from '../../../../store/case/case.reducers';
import { ToastrService } from 'ngx-toastr';

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
    IncompatiblesComponent,
    LoaderComponent,
    ErrorComponent,
    CustomImageComponent,
    MatTooltipModule,
  ],
  templateUrl: './add-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCategoryComponent implements OnInit, OnDestroy {
  private attributes$ = new BehaviorSubject<Attribute[]>([]);
  private cases$ = new BehaviorSubject<Case[]>([]);
  private selectedAttribute$ = new BehaviorSubject<AttributeOption[]>([]);
  private categoryImage$ = new BehaviorSubject<string>('');
  categoryImage = this.categoryImage$.asObservable();
  attributes = this.attributes$.asObservable();
  cases = this.cases$.asObservable();
  selectedAttributes = this.selectedAttribute$.asObservable();
  selectedCases: Case[] = [];
  loadingStatus!: Observable<LoadingStatus>;
  categoryForm!: FormGroup;
  localAttributes: Attribute[] = [];
  localCases: Case[] = [];
  casesMap!: Map<string, Case>;
  isOverflow = false;
  makeLeftButtonGreen = true;
  makeRightButtonGreen = false;
  @ViewChild('contentWrapper') contentWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('parent') parent!: ElementRef<HTMLDivElement>;

  incompatibleSet: Record<string, AttributeOption[]> = {};
  numOfIncompatibles = 0;
  sizes: Record<string, string[]> = {};
  coverImage!: string | null;
  id!: string | null;

  configMap = new Map([
    ['incompatibles', {}],
    ['selected', {}],
    ['notSelected', {}],
  ]);
  incompatibleMap = new Map();

  constructor(
    private store: Store,
    private attributeService: AttributeInputService,
    private router: Router,
    private destroyRef: DestroyRef,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private toast: ToastrService
  ) {}
  ngOnInit(): void {
    this.store.dispatch(getCases());
    this.casesMap = new Map();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.cases = this.store.select(selectCases).pipe(
      tap((cases) => {
        this.localCases = cases;
      })
    );
    this.attributes = this.store.select(selectAttributesState).pipe(
      tap((attrs) => {
        this.localAttributes = attrs;
        this.categoryForm = this.attributeService.toFormGroup(attrs);

        if (this.id) {
          this.store.dispatch(getSingleCategoryAndConfig({ id: this.id }));

          this.store
            .select(selectEditConfigState)
            .pipe(
              tap((editConfig: EditConfigResponse) => {
                const { config, name, thumbnail, cases } = editConfig;

                this.casesMap = new Map();
                this.coverImage = thumbnail;
                this.incompatibleSet = generateIncompatiblesTable(config);
                this.numOfIncompatibles = getNumberOfIncompatibles(
                  this.incompatibleSet
                );
                const editFormValues = this.attributeService.editFormGroup(
                  config,
                  name
                ).value;
                config.forEach((categoryConfig) => {
                  if (!categoryConfig.isCompatible) {
                    this.addSingleIncompatible(categoryConfig);
                    this.localAttributes = removeFromLocalAttributes(
                      this.localAttributes,
                      categoryConfig.attributeOptionId
                    );
                  }
                  if (categoryConfig.isMeasured && categoryConfig.isIncluded) {
                    this.sizes[categoryConfig.type] = generateSizes(
                      categoryConfig.baseAmount,
                      categoryConfig.maxAmount,
                      categoryConfig.unit
                    );
                  }
                });
                this.addSelectedCases(cases);
                this.categoryForm.patchValue({ ...editFormValues });
              }),
              takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
        }
      })
    );
    this.loadingStatus = this.store.select(selectLoaderState);
    this.store
      .select(selectCategoryImageState)
      .pipe(
        tap((imageUrl) => {
          this.coverImage = imageUrl;
        })
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    this.store.dispatch(resetEditState());
    this.store.dispatch(resetImage());
  }

  createConfig() {
    const selectedMap = new Map();

    if (this.categoryForm.invalid) {
      const controls = this.categoryForm.controls;
      for (const name in controls) {
        this.categoryForm.controls[name].markAsTouched();
        this.categoryForm.controls[name].updateValueAndValidity();
      }
      return;
    }

    for (let key in this.categoryForm.value) {
      
      if (
        this.categoryForm.value[key] &&
        (this.categoryForm.value[key]?.id ||
          this.categoryForm.value[key]?.attributeOptionId)
        ) {
        const option =
          this.categoryForm.value[key];
        let size = null;
          
          if (option?.attribute?.isMeasured || option?.isMeasured) {
            const name = option?.attribute?.name || option?.type            
            size = parseInt(
              this.categoryForm.value[`${name}Size`]
            );
            if (isNaN(size)) {
              size =
                this.categoryForm.value[name].additionalInfo
                  .baseAmount;
            }
          }
          const includedOption: CategoryConfig = {
            attributeId: option.attribute?.id || option?.attributeId,
            attributeName: option?.attribute?.name || option?.type,
            attributeOptionId: option?.id || option?.attributeOptionId,
            isCompatible: true,
            isIncluded: true,
            isMeasured: option?.attribute?.isMeasured || option?.isMeasured,
            size: size,
          };
          const mapKey = this.categoryForm.value[key]?.id || this.categoryForm.value[key]?.attributeOptionId
          selectedMap.set(mapKey, includedOption);        
      }
    }
    this.configMap.set('selected', selectedMap);
    const allIncompatibles = this.configMap.get('incompatibles') as Map<
      string,
      CategoryConfig
    >;
    const allSelected = this.configMap.get('selected') as Map<
      string,
      CategoryConfig
    >;

    this.configMap.set(
      'notSelected',
      this.addToNotSelectedMap(
        allIncompatibles,
        allSelected,
        this.localAttributes
      )
    );

    const finalConfig: CategoryConfig[] = [];
    this.configMap.forEach((value) => {
      const mapping = value as Map<string, CategoryConfig>;
      mapping.forEach((value) => {
        finalConfig.push(value);
      });
    });

    const payload: CategoryPayload = {
      name: this.categoryForm.value['categoryName'],
      thumbnail: this.coverImage || '',
      config: finalConfig,
      caseIds: Array.from(this.casesMap.keys()),
    };
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
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

  checkOverflow() {
    setTimeout(() => {
      this.isOverflow = this.isOverflown();
      this.changeDetectorRef.detectChanges();
    }, 0);
  }

  sizeSelection(event: MatAutocompleteSelectedEvent, attribute: Attribute) {
    const selectedSize = event.option.value as string;
    const correspondingAttributeOption: any =
      this.categoryForm.value[attribute.attributeName];
    const newBaseAmount = parseInt(selectedSize);
  }

  addIncompatibleAttribute(
    attributeName: string,
    incompatibleAttributeOptions: AttributeOption[]
  ) {
    this.addSelectedOptionIncompatibles(incompatibleAttributeOptions);
    this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet);

    // Clear involved form fields
    this.selectedAttribute$.next([]);
    const found = incompatibleAttributeOptions.find(
      (option) =>
        option.optionName ===
        (this.categoryForm.value[attributeName]?.name ??
          this.categoryForm.value[attributeName]?.optionName)
    );
    // Remove from selected if it was made incompatible
    if (found) {
      this.categoryForm.patchValue({
        attributesInput: '',
        variants: '',
        [attributeName]: null,
      });
    } else {      
      this.categoryForm.patchValue({ attributesInput: '', variants: '' });
    }

    // this.categoryForm.patchValue({ attributesInput: '', variants: '', [attributeName]: null });
    this.checkOverflow();
    this.addToIncompatiblesMap(incompatibleAttributeOptions || []);
  }

  addToIncompatiblesMap(incompatibleAttributeOptions: AttributeOption[]) {
    incompatibleAttributeOptions.forEach((incompatibleAttributeOption) => {
      const { attribute, id, additionalInfo } = incompatibleAttributeOption;
      const incompatibleOption: CategoryConfig = {
        attributeId: attribute.id,
        attributeName: attribute.name,
        attributeOptionId: id,
        isMeasured: !!attribute.isMeasured,
        size: (additionalInfo && additionalInfo.baseAmount) || null,
        isCompatible: false,
        isIncluded: false,
      };
      this.incompatibleMap.set(
        incompatibleAttributeOption.id,
        incompatibleOption
      );
    });
    this.configMap.set('incompatibles', this.incompatibleMap);
  }

  addSingleIncompatible(incompatibleAttributeOption: CategoryEditResponse) {
    const {
      attributeId,
      attributeOptionId,
      name,
      isMeasured,
      isCompatible,
      isIncluded,
      size,
    } = incompatibleAttributeOption;
    const incompatibleOption: CategoryConfig = {
      attributeId,
      attributeName: name,
      attributeOptionId,
      isMeasured,
      size,
      isCompatible,
      isIncluded,
    };
    this.incompatibleMap.set(attributeOptionId, incompatibleOption);
  }

  addToNotSelectedMap(
    allIncompatibles: Map<string, CategoryConfig>,
    allSelected: Map<string, CategoryConfig>,
    localAttributes: Attribute[]
  ) {
    const nonIncludedMap = new Map();
    localAttributes.forEach((attribute) => {
      attribute.attributeOptions.forEach((option) => {
        if (!allIncompatibles.has(option.id) && !allSelected.has(option.id)) {
          const notSelected: CategoryConfig = {
            attributeId: attribute.id,
            attributeName: attribute.attributeName,
            attributeOptionId: option.id,
            isCompatible: true,
            isIncluded: false,
            isMeasured: attribute.isMeasured,
            size:
              (option.additionalInfo && option.additionalInfo.baseAmount) ||
              null,
          };
          nonIncludedMap.set(option.id, notSelected);
        }
      });
    });
    return nonIncludedMap;
  }

  addSelectedOptionIncompatibles(
    incompatibleAttributeOptions: AttributeOption[]
  ) {
    const { incompatibleSet, localAttributes } = buildIncompatibleTable(
      incompatibleAttributeOptions,
      this.incompatibleSet,
      this.localAttributes
    );
    this.incompatibleSet = incompatibleSet;
    this.localAttributes = localAttributes;
    this.addToIncompatiblesMap(incompatibleAttributeOptions || []);
  }

  addSelectedCases(cases: Case[]) {
    cases.forEach((c) => {
      this.casesMap.set(c.id, c);
    });
    this.selectedCases = Array.from(this.casesMap.values());

    this.selectedCases.forEach((selectedCase) => {
      selectedCase.incompatibleVariants.forEach((variant) => {
        this.addIncompatibleAttribute(
          variant.attribute.name,
          selectedCase.incompatibleVariants
        );
      });
    });
    this.categoryForm.patchValue({ cases: '' });
  }

  removeCase(caseArg: Case) {
    caseArg.incompatibleVariants.forEach((variant) => {
      this.removeAttributeOption(
        variant,
        this.incompatibleSet[variant.attribute.name],
        false
      );
    });

    this.casesMap.delete(caseArg.id);

    this.selectedCases = Array.from(this.casesMap.values());
    this.categoryForm.patchValue({ cases: '' });
  }

  onSelectConfigOptions(event: MatSelectChange, attribute: Attribute) {
    const selectedAttributeOption = event.value as AttributeOption;
    if (attribute.isMeasured) {
      this.sizes[attribute.attributeName] = generateSizes(
        selectedAttributeOption.additionalInfo.baseAmount,
        selectedAttributeOption.additionalInfo.maxAmount,
        attribute.unit
      );
    }
    this.addSelectedOptionIncompatibles(
      selectedAttributeOption.incompatibleAttributeOptions
    );
    this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet);
    this.checkOverflow();
  }

  removeAttributeOption(
    attributeOption: AttributeOption,
    options: AttributeOption[],
    showNotif = true
  ) {
    this.selectedCases = this.selectedCases.filter((selectedCase) => {
      const found = selectedCase.incompatibleVariants.find(
        (variant) => variant.id === attributeOption.id
      );
      if (found) {
        if (showNotif) {
          this.toast.info(
            `Removed ${selectedCase.name} because ${found.optionName} is incompatible with it`,
            'Info'
          );
        }
        return false;
      }
      return true;
    });

    this.casesMap = this.getCaseIds(this.selectedCases);

    this.categoryForm.patchValue({ cases: '' });

    const newAttributeOptions = options.filter(
      (option) => option.id !== attributeOption.id
    );
    if (newAttributeOptions.length === 0) {
      delete this.incompatibleSet[attributeOption.attribute.name];
    } else {
      this.incompatibleSet[attributeOption.attribute.name] =
        newAttributeOptions;
    }

    this.localAttributes = putInLocalAttributes(
      this.localAttributes,
      attributeOption
    );

    this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet);
    this.checkOverflow();
    this.incompatibleMap.delete(attributeOption.id);
    this.configMap.set('incompatibles', this.incompatibleMap);
  }

  getCaseIds(cases: Case[]) {
    const casesMap = new Map<string, Case>();

    cases.forEach((c) => {
      casesMap.set(c.id, c);
    });

    return casesMap;
  }

  replaceImage(obj: { imgSrc: string; imageToChange: string; file?: File }) {
    const data = new FormData();
    this.coverImage = obj.imgSrc;
    if (obj.file) {
      data.append('file', obj.file);
      data.append('upload_preset', UPLOAD_PRESET);
      data.append('cloud_name', CLOUD_NAME);
      this.store.dispatch(uploadCoverImage({ form: data }));
    }
  }

  removeImage() {
    this.categoryForm.patchValue({ coverImage: null });
    this.coverImage = null;
  }

  onSelectChange(event: MatSelectChange) {
    this.selectedAttribute$.next(event.value.attributeOptions);
  }

  isOverflown(): boolean {
    return !!(
      this.contentWrapper.nativeElement.scrollWidth >
      this.parent.nativeElement.clientWidth
    );
  }
  onFocus(control: AbstractControl) {
    const value = control.value;
    control.reset();
    control.patchValue(value);
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
    this.router.navigateByUrl('/admin/categories');
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

  get casesInput() {
    return this.categoryForm.get('cases')!;
  }
}
