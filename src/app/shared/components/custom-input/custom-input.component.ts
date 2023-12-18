import {
  Component,
  HostListener,
  OnInit,
  Input,
  forwardRef,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

type OnChange<T> = (value: T) => void;
type OnTouch = () => void;
@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInputComponent implements OnInit, ControlValueAccessor {
  @Input() type!: string;
  @Input() id!: string;
  @Input() placeholder!: string;
  @Input() label!: string;
  @Input() isDisabled: boolean = false;

  formControl!: FormControl;
  showPassword = false;
  onChange: OnChange<string> = () => {};
  onTouched: OnTouch = () => {};

  constructor(private destroyRef: DestroyRef) {}

  ngOnInit(): void {
    this.formControl = new FormControl({
      value: null,
      disabled: this.isDisabled,
    });
    this.formControl.valueChanges
      .pipe(
        tap((value) => this.onChange(value)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  showPasswordHandler(event: Event) {
    event.stopPropagation();
    this.showPassword = !this.showPassword;    
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
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  @HostListener('focusout')
  onFocusOut() {
    this.onTouched();
  }
}
