import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, Input, OnInit, forwardRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  AbstractControl, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';
type OnChange<T> = (value: T) => void;
type OnTouch = () => void;
@Component({
  selector: 'app-custom-radio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomRadioComponent),
      multi: true,
    },
  ],
  templateUrl: './custom-radio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class CustomRadioComponent implements OnInit {
  @Input() id!: string
  @Input() label!: string
  @Input() name!: string
  @Input() value!: string
  @Input() imgUrl!: string
  @Input() currentPaymentMethod!: string

  onChange: OnChange<string> = () => {};
  onTouched: OnTouch = () => {};
  formControl!: FormControl;

  constructor(private destroyRef: DestroyRef) {}

  ngOnInit(): void {
    this.formControl = new FormControl({
      value: null,
      disabled: false,
    });
    this.formControl.valueChanges
      .pipe(
        tap((value) => this.onChange(value)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
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
