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
import { Attribute, AttributeOption, BulkAttribute, LoadingStatus } from '../../types';
import { getUniqueId } from '../../core/utils/settings';
import { selectAttributeCreationState } from '../../store/category-management/attributes/attributes.reducers';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthLoaderComponent } from '../../shared/components/auth-loader/auth-loader.component';
import { Observable } from 'rxjs';
import { selectLoaderState } from '../../store/loader/reducers/loader.reducers';

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
    AuthLoaderComponent
  ],
  templateUrl: './attribute-modal.component.html',
  styleUrl: './attribute-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeModalComponent implements OnInit {
  modalForm!: FormGroup;
  attributeForm!: FormGroup;
  coverImage: Array<string | null> = [];
  loadingStatus$!: Observable<LoadingStatus>
  submitted = false
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
    this.loadingStatus$ = this.store.select(selectLoaderState)
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
        const baseAmount = attr.additionalInfo.baseAmount ? attr.additionalInfo.baseAmount.toString() : ''
        const maxAmount = attr.additionalInfo.maxAmount ? attr.additionalInfo.maxAmount.toString() : ''
        const priceFactor = attr.additionalInfo.priceFactor ? attr.additionalInfo.priceFactor.toString() : ''
        const price = attr.optionPrice ? attr.optionPrice.toString() : ''
        this.store.dispatch(
          addAttributeToStore({
            baseAmount,
            id: attr.id,
            maxAmount,
            media: attr.optionMedia ? attr.optionMedia : '',
            name: attr.optionName ? attr.optionName : '',
            price,
            priceFactor
          })
        );
      }
      this.attributeForm = this.fb.group({
        attributeName: [attributeName, Validators.required],
        description: [description],
        isMeasured: [isMeasured],
        unit: [unit],
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
        unit: [''],
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
      priceFactor: additionalInfo.priceFactor,
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
    this.submitted = true
    if (this.attributeForm.invalid) {
      console.log('Dont send data');
      this.submitted = false
      return
    }
    const validAttributes = this.attributeForm.value.attributes.map(
      (attr: any) => {
        return {
          ...attr,
          media: null,
        };
      }
    );

    this.store.dispatch(
      updateAttributesInStore({ attributes: validAttributes })
    );
    if (this.editId) {
      console.log('Is Editing', this.editId);
      
      this.store
        .select(selectAttributeCreationState)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((options) => {
          const isMeasured = this.attributeForm.value.isMeasured
          let attribute = {
            attributeName: this.attributeForm.value.attributeName,
            description: this.attributeForm.value.description,
            isMeasured,
            unit: isMeasured ? this.attributeForm.value.unit : '',
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
        // setTimeout(() => {
          
        // }, 1500);
        this.dialogRef.close();
      });
  }

  addAttributeForm() {
    const id = getUniqueId(4);

    this.attributes.push(
      this.fb.group({
        name: [''],
        price: ['', Validators.required],
        media: null,
        baseAmount: ['', Validators.required],
        maxAmount: ['', Validators.required],
        priceFactor: ['', Validators.required],
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
        priceFactor: '',
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
