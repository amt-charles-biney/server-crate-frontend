import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { OnChange, OnTouch } from '../../../types';
import { Observable, fromEvent, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-custom-image',
  standalone: true,
  imports: [
    CommonModule,
    RxReactiveFormsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './custom-image.component.html',
  styleUrl: './custom-image.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomImageComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomImageComponent
  implements OnInit, ControlValueAccessor, AfterViewInit
{
  @ViewChild('imagePreview') imagePreview!: ElementRef;
  @ViewChild('remove') removeElementRef!: ElementRef;
  @Input() elementId!: string;
  @Input() label!: string;
  @Input() customClass!: string;
  @Input() previewClass!: string;
  @Input() containerClass!: string;
  @Input() previewImage: string | null | ArrayBuffer = null;
  @Input() editId!: string | null;
  editMode!: boolean
  noImageSelected!: boolean
  formControl!: FormControl;
  onChange: OnChange<string> = () => {};
  onTouched: OnTouch = () => {};
  constructor(private destroyRef: DestroyRef) {}
  ngOnInit(): void {
    console.log(`Edit image of ${this.elementId}`, this.previewImage);
    this.editMode = !!this.editId
    this.formControl = new FormControl({
      value: null,
      disabled: false,
    });
    this.formControl.valueChanges
      .pipe(
        tap((value) => {
          this.onChange(value);  
          this.editMode = false    
          console.log(this.imagePreview);
          
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
  ngAfterViewInit(): void {
    console.log('image preview', this.previewImage);
    if (this.imagePreview) {
      this.imagePreview.nativeElement.src = this.previewImage
    }
  }
  uploadDocument(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {        
        if (this.imagePreview) {
          this.imagePreview.nativeElement.src = '/assets/uploading.svg';
        }
        console.log('Loading image');
      };
      reader.onloadend = (event) => {
        console.log('image added');
        if (this.imagePreview) {
          this.imagePreview.nativeElement.src = reader.result;          
        } else {
          this.previewImage = reader.result
        }
      };
    }
  }
  removeImage() {
    // this.imagePreview.nativeElement.src = null;
    this.previewImage = null;
    this.formControl.patchValue({ value: null });
    console.log('formcontrol value', this.formControl.value);
    
  }

  writeValue(value: string): void {
    if (value === null) return;
    this.formControl.setValue(value, { emitEvent: false });
  }
  registerOnChange(fn: OnChange<string>): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: OnTouch): void {
    this.onTouched = fn;
  }

  @HostListener('focusout')
  onFocusOut() {
    this.onTouched();
  }
}
