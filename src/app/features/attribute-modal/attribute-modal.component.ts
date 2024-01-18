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
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { CustomCheckBoxComponent } from '../../shared/components/custom-check-box/custom-check-box.component';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomImageComponent } from '../../shared/components/custom-image/custom-image.component';
import { Store } from '@ngrx/store';
import {
  addAttribute,
  addAttributeToStore,
  deleteAttributeOption,
  updateAttribute,
  updateAttributesInStore,
  uploadImage,
} from '../../store/category-management/attributes/attributes.actions';
import { CLOUD_NAME, UPLOAD_PRESET } from '../../core/utils/constants';
import { AdminService } from '../../core/services/admin/admin.service';
import { Attribute, AttributeOption, BulkAttribute } from '../../types';
import { getUniqueId } from '../../core/utils/settings';
import { selectAttributeCreationState } from '../../store/category-management/attributes/attributes.reducers';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  ],
  templateUrl: './attribute-modal.component.html',
  styleUrl: './attribute-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeModalComponent implements OnInit {
  modalForm!: FormGroup;
  attributeForm!: FormGroup;
  coverImage: Array<string | null> = [];
  id = '';
  editId: string | null = null;
  constructor(
    public dialogRef: MatDialogRef<AttributeModalComponent>,
    private store: Store,
    private adminService: AdminService,
    private fb: FormBuilder,
    private destroyRef: DestroyRef,
    @Inject(MAT_DIALOG_DATA) public data: { attribute: Attribute }
  ) {}
  ngOnInit(): void {
    if (this.data && this.data.attribute) {
      const {
        attributeName,
        attributeOptions,
        description,
        id,
        isMeasured,
        unit,
      } = this.data.attribute;
      console.log('Attribute', this.data.attribute);
      this.editId = id;
      for (let attr of attributeOptions) {
        this.store.dispatch(
          addAttributeToStore({
            baseAmount: attr.additionalInfo.baseAmount.toString(),
            id: attr.id,
            maxAmount: attr.additionalInfo.maxAmount.toString(),
            media: attr.optionMedia,
            name: attr.optionName,
            price: attr.optionPrice.toString(),
            priceIncrement: attr.additionalInfo.priceIncrement.toString(),
          })
        );
      }
      this.attributeForm = this.fb.group({
        attributeName: [attributeName, Validators.required],
        description: [description],
        isMeasured: [isMeasured],
        unit: [unit, Validators.required],
        attributes: this.fb.array(
          attributeOptions.map((attributeOption) =>
            this.createAttr(attributeOption)
          )
        ),
      });
    } else {
      this.attributeForm = this.fb.group({
        attributeName: ['', Validators.required],
        description: [''],
        isMeasured: [false],
        unit: ['', Validators.required],
        attributes: this.fb.array([]),
      });
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
    } = attributeOption;
    console.log('attributeOption', attributeOption);
    this.coverImage.push(optionMedia);
    return this.fb.group({
      name: [optionName],
      price: optionPrice,
      media: optionMedia,
      baseAmount: additionalInfo.baseAmount,
      maxAmount: additionalInfo.maxAmount,
      priceIncrement: additionalInfo.priceIncrement,
      id,
      coverImage: optionMedia,
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
    
    const validAttributes = this.attributeForm.value.attributes.map(
      (attr: any) => {
        return {
          ...attr,
          media: null,
        };
      }
    );
    console.log(validAttributes);

    this.store.dispatch(
      updateAttributesInStore({ attributes: validAttributes })
    );
    if (this.editId) {
      console.log('Is Editing', this.editId);
      
      this.store
        .select(selectAttributeCreationState)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((options) => {
          let attribute = {
            id: this.editId!,
            attributeName: this.attributeForm.value.attributeName,
            description: this.attributeForm.value.description,
            isMeasured: this.attributeForm.value.isMeasured,
            unit: this.attributeForm.value.unit,
            variantOptions: options,
          };
          console.log('Sending', attribute);
          this.store.dispatch(updateAttribute(attribute))
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
          unit: this.attributeForm.value.unit,
          variantOptions: options,
        };
        this.store.dispatch(addAttribute(attribute));
        console.log('Sending', attribute);
        this.dialogRef.close();
      });
  }

  addAttributeForm() {
    const id = getUniqueId(4);

    this.attributes.push(
      this.fb.group({
        name: [''],
        price: '',
        media: null,
        baseAmount: '',
        maxAmount: '',
        priceIncrement: '',
        id,
        coverImage: '',
      })
    );
    // console.log('fomr values', ...this.attributeForm.value.attributes);
    // const primitiveFileList: FileList = this.attributeForm.value.media;
    // console.log('filelist', primitiveFileList);

    this.store.dispatch(
      addAttributeToStore({
        name: '',
        price: '',
        media: '',
        baseAmount: '',
        maxAmount: '',
        priceIncrement: '',
        id,
      })
    );
    this.id = id;
  }

  deleteOption(index: number, optionId: string) {
    if (this.editId) {
      this.store.dispatch(deleteAttributeOption({ optionId }))
    } else {
      this.attributes.removeAt(index)
    }
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
