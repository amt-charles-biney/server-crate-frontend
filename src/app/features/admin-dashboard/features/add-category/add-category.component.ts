import { Case, CategoryPayload, EditConfigResponse } from './../../../../types';
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
  getConfigPayload,
  getEditConfigPayload,
  getNumberOfIncompatibles,
  isCategoryEditResponse,
  putInLocalAttributes,
  removeFromLocalAttributes,
  removeFromPayload,
  removeVariantsFromPayload,
  updateConfigPayload,
  updateConfigSizes,
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
  categoryConfigPayload: Map<string, CategoryConfig[]> = new Map();
  loadingStatus!: Observable<LoadingStatus>;
  categoryForm!: FormGroup;
  localAttributes: Attribute[] = [];
  localCases: Case[] = [];
  casesMap!: Map<string, Case>
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
        this.categoryConfigPayload = getConfigPayload(this.localAttributes);

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
                  if (categoryConfig.isMeasured && categoryConfig.isIncluded) {
                    this.sizes[categoryConfig.type] = generateSizes(
                      categoryConfig.baseAmount,
                      categoryConfig.maxAmount,
                      categoryConfig.unit
                    );
                  }
                  if (!categoryConfig.isCompatible) {
                    this.localAttributes = removeFromLocalAttributes(
                      this.localAttributes,
                      categoryConfig.attributeOptionId
                    );
                  }
                });
                this.categoryConfigPayload = getEditConfigPayload(config);
                this.categoryForm.patchValue({ ...editFormValues });
                this.addSelectedCases(cases);
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
    let categoryConfig: CategoryConfig[] = [];
    this.categoryConfigPayload.forEach((config) => {
      categoryConfig = categoryConfig.concat(config);
    });

   
    if (this.categoryForm.invalid) {
      const controls = this.categoryForm.controls;
      for (const name in controls) {
        this.categoryForm.controls[name].markAsTouched();
        this.categoryForm.controls[name].updateValueAndValidity();
      }
      return;
    }
    const payload: CategoryPayload = {
      name: this.categoryForm.value['categoryName'],
      thumbnail: this.coverImage || '',
      config: categoryConfig,
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
    if (isCategoryEditResponse(correspondingAttributeOption)) {
      this.categoryConfigPayload = updateConfigSizes(
        attribute.attributeName,
        correspondingAttributeOption.attributeOptionId,
        this.categoryConfigPayload,
        newBaseAmount
      );
    } else {
      this.categoryConfigPayload = updateConfigSizes(
        attribute.attributeName,
        correspondingAttributeOption.id,
        this.categoryConfigPayload,
        newBaseAmount
      );
    }
  }

  addIncompatibleAttribute(
    categoryConfigPayload: Map<string, CategoryConfig[]>,
    attributeName: string,
    incompatibleAttributeOptions: AttributeOption[]
  ) {
    this.categoryConfigPayload = removeFromPayload(
      categoryConfigPayload,
      attributeName,
      incompatibleAttributeOptions
    );

    this.reassign(incompatibleAttributeOptions);
    this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet);

    // Clear involved form fields
    this.selectedAttribute$.next([]);
    this.categoryForm.patchValue({ attributesInput: '', variants: '' });
    this.checkOverflow();
  }

  reassign(incompatibleAttributeOptions: AttributeOption[]) {
    const { incompatibleSet, localAttributes } = buildIncompatibleTable(
      incompatibleAttributeOptions,
      this.incompatibleSet,
      this.localAttributes
    );
    this.incompatibleSet = incompatibleSet;
    this.localAttributes = localAttributes;
  }
  

  addSelectedCases(cases: Case[]) {  
      
    cases.forEach((c) => {
      this.casesMap.set(c.id, c);
    });
    this.selectedCases = Array.from(this.casesMap.values());
    
    this.selectedCases.forEach((selectedCase) => {
      selectedCase.incompatibleVariants.forEach((variant) => {
        this.addIncompatibleAttribute(
          this.categoryConfigPayload,
          variant.attribute.name,
          selectedCase.incompatibleVariants
        );
      });
    });    
    this.categoryForm.patchValue({ cases: '' });
  }

  removeCase(caseArg: Case) {
    caseArg.incompatibleVariants.forEach((variant) => {
      this.removeAttributeOption(variant, this.incompatibleSet[variant.attribute.name])
    })

    this.casesMap.delete(caseArg.id)
    
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
    this.categoryConfigPayload = updateConfigPayload(
      selectedAttributeOption,
      this.categoryConfigPayload,
      true
    );
    this.categoryConfigPayload = removeVariantsFromPayload(
      this.categoryConfigPayload,
      selectedAttributeOption.incompatibleAttributeOptions
    );
    this.reassign(selectedAttributeOption.incompatibleAttributeOptions);
    this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet);
    this.checkOverflow();
  }

  removeAttributeOption(
    attributeOption: AttributeOption,
    options: AttributeOption[]
  ) {
    this.selectedCases = this.selectedCases.filter((selectedCase) => {
      const found = selectedCase.incompatibleVariants.find(
        (variant) => variant.id === attributeOption.id
      );
      if (found) {        
        // this.toast.info(`Removed ${selectedCase.name} because ${found.optionName} is incompatible with it`, "Info")
        return false;
      }
      return true;
    });    
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
    this.categoryConfigPayload = updateConfigPayload(
      attributeOption,
      this.categoryConfigPayload,
      false
    );
    this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet);
    this.checkOverflow();
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
