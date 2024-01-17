import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
  updateAttributesInStore,
  uploadImage,
} from '../../store/category-management/attributes/attributes.actions';
import { CLOUD_NAME, UPLOAD_PRESET } from '../../core/utils/constants';
import { AdminService } from '../../core/services/admin/admin.service';
import { BulkAttribute } from '../../types';
import { getUniqueId } from '../../core/utils/settings';
import { selectAttributeCreationState } from '../../store/category-management/attributes/attributes.reducers';
import { tap } from 'rxjs';
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
  constructor(
    public dialogRef: MatDialogRef<AttributeModalComponent>,
    private store: Store,
    private adminService: AdminService,
    private fb: FormBuilder,
    private destroyRef: DestroyRef
  ) {}
  ngOnInit(): void {

    this.attributeForm = this.fb.group({
      attributeName: ['', Validators.required],
      description: [''],
      isMeasured: [false],
      unit: ['', Validators.required],
      attributes: this.fb.array([]),
    });
  }

  replaceImage(obj: { imgSrc: string; imageToChange: string; file?: File }, id: number, attrs: AbstractControl, index: number) {
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
    const validAttributes = this.attributeForm.value.attributes.map((attr:any) => {
      return {
        ...attr,
        media: null
      }
    })
    console.log(validAttributes);
    
    this.store.dispatch(updateAttributesInStore({attributes: validAttributes}))
    this.store.select(selectAttributeCreationState).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((options) => {
      let attribute = {
        attributeName: this.attributeForm.value.attributeName,
        description: this.attributeForm.value.description,
        isMeasured: this.attributeForm.value.isMeasured,
        unit: this.attributeForm.value.unit,
        variantOptions: options
      }
      this.store.dispatch(addAttribute(attribute))
      console.log('Sending', attribute)
      this.dialogRef.close()
    })
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
        coverImage: ''
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
    this.id = id
  }

  get attributes() {
    return this.attributeForm.get('attributes') as FormArray;
  }

  get attributeName() {
    return this.attributeForm.get('attributeName')!
  }

  get isMeasured() {
    return this.attributeForm.get('isMeasured')!;
  }
  
}
