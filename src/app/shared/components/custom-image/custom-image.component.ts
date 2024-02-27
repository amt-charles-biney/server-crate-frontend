import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
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
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { removeCloudinaryBaseUrl } from '../../../core/utils/helpers';

@Component({
  selector: 'app-custom-image',
  standalone: true,
  imports: [
    CommonModule,
    RxReactiveFormsModule,
    ReactiveFormsModule,
    FormsModule,
    NgOptimizedImage,
    
  ],
  templateUrl: './custom-image.component.html',
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
  implements OnInit, ControlValueAccessor, OnChanges
{
  @ViewChild('remove') removeElementRef!: ElementRef;
  @Input() elementId!: string;
  @Input() label!: string;
  @Input() customClass!: string;
  @Input() containerClass!: string;
  @Input() previewImage: string | null | ArrayBuffer = null;
  @Input() editId!: string | null;
  @Input() width!: string;
  @Input() height!: string;
  localPreview: string | null | ArrayBuffer = null
  isCloudinary!: boolean
  @Output() removeImageEmitter = new EventEmitter<string>()
  @Output() uploadImageEmitter = new EventEmitter<{imgSrc: string, imageToChange: string, file?: File}>()
  formControl!: FormControl;
  
  onChange: OnChange<string> = () => {};
  onTouched: OnTouch = () => {};
  constructor(private destroyRef: DestroyRef) {}
  ngOnInit(): void {
    this.onInit()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localPreview = removeCloudinaryBaseUrl(changes['previewImage'].currentValue || '')
    this.isCloudinary = changes['previewImage'].currentValue?.includes('cloudinary')
  }

  onInit() {
    this.formControl = new FormControl({
      value: null,
      disabled: false,
    });
    this.formControl.valueChanges
      .pipe(
        tap((value) => {
          this.onChange(value);            
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  uploadDocument(event: any) {    
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = (event) => {
        this.uploadImageEmitter.emit({imgSrc: reader.result as string, imageToChange: this.elementId, file })
      };
    }
  }
  removeImage() {
    this.removeImageEmitter.emit(this.elementId)
    if (this.editId) {
      this.localPreview = null;
    } 
    else {
      this.onInit()
    }    
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
