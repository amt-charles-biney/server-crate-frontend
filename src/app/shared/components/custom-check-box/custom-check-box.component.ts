import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { OnChange, OnTouch } from '../../../types';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { getUniqueId } from '../../../core/utils/settings';

@Component({
  selector: 'app-custom-check-box',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomCheckBoxComponent),
      multi: true,
    },
  ],
  templateUrl: './custom-check-box.component.html',
})
export class CustomCheckBoxComponent {
  @Input() label!: string;
  @Input() value!: string;
  @Input() name!: string;
  @Input() customClass: string = "max-w-28 overflow-hidden text-ellipsis whitespace-nowrap"
  @Output() changeHandler = new EventEmitter<{ name: string, value: string, isAdded: boolean }>();
  @ViewChild('inputState') inputState!: ElementRef<HTMLInputElement>
  onChange: OnChange<any> = () => {};
  onTouched: OnTouch = () => {};
  formControl!: FormControl;
  randomId = getUniqueId(1)
  constructor(private destroyRef: DestroyRef) {}

  ngOnInit(): void {
    this.formControl = new FormControl({
      value: null,
      disabled: false,
    });
    this.formControl.valueChanges
      .pipe(
        tap((value) => {                
          this.onChange({ name: this.name, checked: value });          
          this.changeHandler.emit({name: this.name, value: this.value, isAdded: value })           
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  writeValue(value: boolean | { checked: boolean, name: string}): void {
    if (value === null) return;
    this.onChange(value)
    if (typeof value === 'boolean') {
      this.formControl.patchValue(value, { emitEvent: false });   
    } else {
      this.formControl.patchValue(value.checked, { emitEvent: false });   
    }
  }
  registerOnChange(fn: OnChange<any>): void {    
    this.onChange = fn;
  }
  registerOnTouched(fn: OnTouch): void {
    this.onTouched = fn;
  }

  @HostListener('click', ['$event'])
  onClick(e: Event) {
    e.stopPropagation()
    return
  }
}
