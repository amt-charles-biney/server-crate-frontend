import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
  OnInit,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CustomInputComponent } from '../../../../../../shared/components/custom-input/custom-input.component';
import { CustomCheckBoxComponent } from '../../../../../../shared/components/custom-check-box/custom-check-box.component';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomImageComponent } from '../../../../../../shared/components/custom-image/custom-image.component';
import { Store } from '@ngrx/store';
import {
  addAttribute,
  addAttributeToStore,
  deleteAttributeOption,
  updateAttribute,
  updateAttributesInStore,
  uploadImage,
} from '../../../../../../store/category-management/attributes/attributes.actions';
import {
  CLOUD_NAME,
  UPLOAD_PRESET,
} from '../../../../../../core/utils/constants';
import { AdminService } from '../../../../../../core/services/admin/admin.service';
import {
  Attribute,
  AttributeOption,
  LoadingStatus,
} from '../../../../../../types';
import { selectAttributeCreationState } from '../../../../../../store/category-management/attributes/attributes.reducers';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthLoaderComponent } from '../../../../../../shared/components/auth-loader/auth-loader.component';
import { Observable } from 'rxjs';
import { selectLoaderState } from '../../../../../../store/loader/reducers/loader.reducers';
import { CustomSelectComponent } from '../../../../../../shared/components/custom-select/custom-select.component';
import {
  attributeFormValidator,
  unitRequiredIfMeasured,
} from '../../../../../../core/utils/validators';
import { v4 as uuidv4 } from 'uuid'
import { IncompatiblesComponent } from '../../../../../../shared/components/incompatibles/incompatibles.component';
@Component({
  selector: 'app-attribute-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    CustomInputComponent,
    CustomCheckBoxComponent,
    FormsModule,
    ReactiveFormsModule,
    CustomImageComponent,
    AuthLoaderComponent,
    CustomSelectComponent,
    IncompatiblesComponent
  ],
  templateUrl: './attribute-modal.component.html',
  styleUrl: './attribute-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeModalComponent implements OnInit {
  modalForm!: FormGroup;
  attributeForm!: FormGroup;
  coverImage: Array<string | null> = [];
  loadingStatus$!: Observable<LoadingStatus>;
  id = '';
  editId: string | null = null;
  incompatibleAttributeOptions: string[] = []
  incompatibleVariants: Record<string, AttributeOption[]> = {}
  incompatibleSet: Record<string, string[]> = {}
  collapsedIndex!: number 
  constructor(
    public dialogRef: MatDialogRef<AttributeModalComponent>,
    private store: Store,
    private adminService: AdminService,
    private fb: FormBuilder,
    private destroyRef: DestroyRef,
    @Inject(MAT_DIALOG_DATA) public data: { attribute: Attribute, index: number }
  ) {}
  ngOnInit(): void {
    this.loadingStatus$ = this.store.select(selectLoaderState);
    if (this.data && this.data.attribute) {
      const {
        attributeName,
        attributeOptions,
        description,
        id,
        isMeasured,
        unit,
        isRequired,
      } = this.data.attribute;
      this.editId = id;
      attributeOptions.forEach((attr, index) => {
        const baseAmount = attr.additionalInfo.baseAmount
          ? attr.additionalInfo.baseAmount.toString()
          : '';
        const maxAmount = attr.additionalInfo.maxAmount
          ? attr.additionalInfo.maxAmount.toString()
          : '';
        const priceFactor = attr.additionalInfo.priceFactor
          ? attr.additionalInfo.priceFactor.toString()
          : '';
        const brand = attr.brand ? attr.brand.toString() : ''
        const inStock = attr.inStock ? attr.inStock.toString() : ''
        const price = attr.optionPrice ? attr.optionPrice.toString() : '';
        const incompatibleAttributeOptions = attr.incompatibleAttributeOptions ? attr.incompatibleAttributeOptions : []
        this.incompatibleVariants[index] = incompatibleAttributeOptions
        this.incompatibleSet[index] = incompatibleAttributeOptions.map((option) => option.id)
        
        this.store.dispatch(
          addAttributeToStore({
            baseAmount,
            id: attr.id,
            maxAmount,
            media: attr.optionMedia ? attr.optionMedia : '',
            name: attr.optionName ? attr.optionName : '',
            price,
            priceFactor,
            brand,
            inStock,
            incompatibleAttributeOptions
          })
        );
      })
      this.collapsedIndex = this.data.index      
      this.attributeForm = this.fb.group(
        {
          attributeName: [attributeName, Validators.required],
          description: [description],
          isMeasured: [isMeasured],
          isRequired: [isRequired],
          unit: [unit || 'GB', unitRequiredIfMeasured()],
          attributes: this.fb.array(
            attributeOptions.map((attributeOption) =>
              this.createAttr(attributeOption)
            )
          ),
        },
      );
    } else {
      this.attributeForm = this.fb.group(
        {
          attributeName: ['', Validators.required],
          description: [''],
          isMeasured: [false],
          isRequired: [false],
          unit: ['GB', unitRequiredIfMeasured()],
          attributes: this.fb.array<FormGroup[]>([]),
        },
      );
      this.addAttributeForm();
    }
  }
  createAttr(attributeOption: AttributeOption): FormGroup {
    const {
      additionalInfo,
      attribute,
      id,
      optionMedia,
      optionName,
      optionPrice,
      brand,
      inStock,
      incompatibleAttributeOptions
    } = attributeOption;
    this.coverImage.push(optionMedia || null);
    return this.fb.group({
      name: [optionName],
      price: optionPrice,
      media: optionMedia,
      baseAmount: additionalInfo.baseAmount,
      maxAmount: additionalInfo.maxAmount,
      priceFactor: additionalInfo.priceFactor,
      id,
      coverImage: optionMedia,
      brand,
      inStock,
      incompatibleAttributeOptions
    });
  }
  replaceImage(
    obj: { imgSrc: string; imageToChange: string; file?: File },
    id: number,
    attrs: AbstractControl,
    index: number
  ) {
    const data = new FormData();
    this.coverImage[index] = obj.imgSrc;
    if (obj.file) {
      data.append('file', obj.file);
      data.append('upload_preset', UPLOAD_PRESET);
      data.append('cloud_name', CLOUD_NAME);
      this.store.dispatch(uploadImage({ form: data, id: id.toString() }));
    }
  }
  removeImage(imageToRemove: string, index: number) {
    this.attributes.at(index).patchValue({ media: null });
    this.coverImage[index] = null;
  }

  addAttribute() {
    if (this.attributeForm.invalid) {
      this.attributeForm.markAllAsTouched()
      return;
    }    
    const validAttributes = this.attributeForm.value.attributes.map(
      (attr: any, index: number) => {                
        return {
          ...attr,
          media: null,
          incompatibleAttributeOptions: this.incompatibleSet[index]
        };
      }
    );

    this.store.dispatch(
      updateAttributesInStore({ attributes: validAttributes })
    );
    if (this.editId) {
      

      this.store
        .select(selectAttributeCreationState)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((options) => {          
          const isMeasured = this.attributeForm.value.isMeasured;
          let attribute = {
            attributeName: this.attributeForm.value.attributeName,
            description: this.attributeForm.value.description,
            isMeasured,
            isRequired: this.attributeForm.value.isRequired,
            unit: isMeasured ? this.attributeForm.value.unit : '',
            variantOptions: options,
            id: this.editId
          };          
          this.store.dispatch(updateAttribute(attribute));
        });
      this.dialogRef.close();
      return;
    }
    this.store
      .select(selectAttributeCreationState)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((options) => {        
        let attribute = {
          attributeName: this.attributeForm.value.attributeName,
          description: this.attributeForm.value.description,
          isMeasured: this.attributeForm.value.isMeasured,
          isRequired: this.attributeForm.value.isRequired,
          unit: this.attributeForm.value.unit,
          variantOptions: options,
        };        
        this.store.dispatch(addAttribute(attribute));
        this.dialogRef.close();
      });
  }

  updateValidator(controlName: string, validator: ValidatorFn, form: FormGroup) {
    form.get(controlName)?.setValidators(validator)
    form.get(controlName)?.updateValueAndValidity()
  }
  removeValidator(controlName: string, validator: ValidatorFn | null, form: FormGroup) {

      if (validator !== null ) {
        form.get(controlName)?.removeValidators(validator)
      } else {
        form.get(controlName)?.clearValidators()
      }
    form.get(controlName)?.updateValueAndValidity()
  }
  
  modifyValidator() {
    this.attributes.controls.forEach((formGroup: AbstractControl) => {
      if (formGroup instanceof FormGroup) {
        if (this.isMeasured.value) {
          this.updateValidator('baseAmount', Validators.required, formGroup)
          this.updateValidator('maxAmount', Validators.required, formGroup)
          this.updateValidator('priceFactor', Validators.required, formGroup)
          this.updateValidator('unit', unitRequiredIfMeasured(), formGroup)          
        } else {
          this.removeValidator('baseAmount', Validators.required, formGroup)
          this.removeValidator('maxAmount', Validators.required, formGroup)
          this.removeValidator('priceFactor', Validators.required, formGroup)
          this.removeValidator('unit', null, formGroup)
        }
      }
    });
  }

  getIncompatibleAttributeOptions({index, variants}: {index: number, variants: string[]}) {
    this.incompatibleSet[index] = [...variants]
    this.incompatibleAttributeOptions = [...this.incompatibleAttributeOptions, ...variants]
  }

  addAttributeForm() {
    const id = uuidv4()
    const commonAttributes = {
      name: ['', Validators.required],
      brand: ['', Validators.required],
      inStock: ['', Validators.required],
      price: ['', Validators.required],
      media: null,
      baseAmount: this.isMeasured.value ? ['', [Validators.required]] : [''],
      maxAmount: this.isMeasured.value ? ['', Validators.required] : [''],
      priceFactor: this.isMeasured.value ? ['', Validators.required] : [''],
      id,
      coverImage: '',
      incompatibleAttributeOptions: [[]]
    };

    this.attributes.push(
      this.fb.group(
        this.isMeasured.value
          ? { ...commonAttributes, ...{ validators: attributeFormValidator() } }
          : commonAttributes
      )
    );

    this.store.dispatch(
      addAttributeToStore({
        name: '',
        price: '',
        media: '',
        baseAmount: '',
        maxAmount: '',
        priceFactor: '',
        brand: '',
        inStock: '',
        incompatibleAttributeOptions: [],
        id,
      })
    );
    this.id = id;
  }

  deleteOption(index: number, optionId: string) {
    if (this.editId) {
      this.store.dispatch(
        deleteAttributeOption({ optionId, attributeId: this.data.attribute.id })
      );
      this.attributes.removeAt(index)
    } else {
      this.attributes.removeAt(index);
    }
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.attributeForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  get attributes() {
    return this.attributeForm.get('attributes') as FormArray;
  }

  get attributeName() {
    return this.attributeForm.get('attributeName')!;
  }

  get isMeasured() {
    return this.attributeForm.get('isMeasured')!;
  }
}
