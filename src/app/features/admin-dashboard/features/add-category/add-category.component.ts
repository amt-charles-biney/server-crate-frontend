import {
  CategoryPayload,
  EditConfigResponse,
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
  sendConfig,
  sendEditedConfig,
} from '../../../../store/category-management/attributes/config/config.actions';
import { AuthLoaderComponent } from '../../../../shared/components/auth-loader/auth-loader.component';
import { selectLoaderState } from '../../../../store/loader/reducers/loader.reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { selectEditConfigState } from '../../../../store/category-management/attributes/config/config.reducers';
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
  updateConfigPayload,
  updateConfigSizes,
} from '../../../../core/utils/helpers';
import { MatMenuModule } from '@angular/material/menu';
import { CustomSizeSelectionComponent } from '../../../../shared/components/custom-size-selection/custom-size-selection.component';
import { IncompatiblesComponent } from '../../../../shared/components/incompatibles/incompatibles.component';
import { LoaderComponent } from '../../../../core/components/loader/loader.component';
import { ErrorComponent } from '../../../../shared/components/error/error.component';

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
    ErrorComponent
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

  categoryConfigPayload: Map<string, CategoryConfig[]> = new Map();

  loadingStatus!: Observable<LoadingStatus>;
  categoryForm!: FormGroup;
  localAttributes: Attribute[] = [];
  isOverflow = false;
  makeLeftButtonGreen = true;
  makeRightButtonGreen = false;
  @ViewChild('contentWrapper') contentWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('parent') parent!: ElementRef<HTMLDivElement>;

  incompatibleSet: Record<string, AttributeOption[]> = {};
  numOfIncompatibles = 0;
  sizes: Record<string, string[]> = {};

  id!: string | null;

  constructor(
    private store: Store,
    private attributeService: AttributeInputService,
    private router: Router,
    private destroyRef: DestroyRef,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
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
                const { config, name } = editConfig;
                this.incompatibleSet = generateIncompatiblesTable(config);
                this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet)
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
              }),
              takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
        }
      })
    );
    this.loadingStatus = this.store.select(selectLoaderState);
  }
  ngOnDestroy(): void {
    this.store.dispatch(resetEditState());
  }

  createConfig() {
    let categoryConfig: CategoryConfig[] = [];
    this.categoryConfigPayload.forEach((config) => {
      categoryConfig = categoryConfig.concat(config);
    });

    const payload: CategoryPayload = {
      name: this.categoryForm.value['categoryName'],
      config: categoryConfig,
    };

    if (this.categoryForm.invalid) {
      const controls = this.categoryForm.controls;
      for (const name in controls) {
        this.categoryForm.controls[name].markAsTouched();
        this.categoryForm.controls[name].updateValueAndValidity();
      }
      return;
    }
    scrollTo({ top: 0, behavior: 'smooth' });
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
      
      this.isOverflow = this.isOverflown()
      this.changeDetectorRef.detectChanges()
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
    attribute: Attribute,
    incompatibleAttributeOptions: AttributeOption[]
  ) {
    this.categoryConfigPayload = removeFromPayload(
      categoryConfigPayload,
      attribute.attributeName,
      incompatibleAttributeOptions
    );

    this.reassign(incompatibleAttributeOptions)
    this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet);

    // Clear involved form fields
    this.selectedAttribute$.next([]);
    this.categoryForm.patchValue({ attributesInput: '', variants: '' });
    this.checkOverflow()
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
    this.reassign(selectedAttributeOption.incompatibleAttributeOptions)
    this.numOfIncompatibles = getNumberOfIncompatibles(this.incompatibleSet);
    this.checkOverflow()    
  }

  removeAttributeOption(
    attributeOption: AttributeOption,
    options: AttributeOption[]
  ) {
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
    this.checkOverflow()
  }

  

  onSelectChange(event: MatSelectChange) {
    this.selectedAttribute$.next(event.value.attributeOptions);
  }

  isOverflown(): boolean {    
    return !!(this.contentWrapper.nativeElement.scrollWidth > this.parent.nativeElement.clientWidth)
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
