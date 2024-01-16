import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { CustomCheckBoxComponent } from '../../shared/components/custom-check-box/custom-check-box.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomImageComponent } from '../../shared/components/custom-image/custom-image.component';

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
    CustomImageComponent
  ],
  templateUrl: './attribute-modal.component.html',
  styleUrl: './attribute-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeModalComponent implements OnInit {
  modalForm!: FormGroup;
  coverImage: string | null = '';
  constructor(public dialogRef: MatDialogRef<AttributeModalComponent>) {}
  ngOnInit(): void {
    this.modalForm = new FormGroup({
      attributeName: new FormControl('', Validators.required),
      description: new FormControl(''),
      measurement: new FormControl(false),
      unit: new FormControl('', Validators.required),
      coverImage: new FormControl(null)
    });
  }

  get measurement() {
    return this.modalForm.get('measurement')!;
  }
  replaceImage(obj: { imgSrc: string; imageToChange: string }) {
    const setterFunctions: Record<string, (src: string) => void> = {
      coverImage: (src: string) => {
        this.coverImage = src;
      },
    };

    const setter = setterFunctions[obj.imageToChange];
    if (setter) {
      setter(obj.imgSrc);
    }
  }
  removeImage(imageToRemove: string) {    
      this.removeCoverImage();
    
  }
  removeCoverImage() {
    this.modalForm.patchValue({ coverImage: null });
    this.coverImage = null;
  }
}
