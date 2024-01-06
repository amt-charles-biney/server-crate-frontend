import {
  Component,
  HostListener,
  OnInit,
  Input,
  forwardRef,
  DestroyRef,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Select, OnChange, OnTouch } from '../../../types';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
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
export class CustomInputComponent
  implements OnInit, ControlValueAccessor, AfterViewInit
{
  @Input() type!: string;
  @Input() id!: string;
  @Input() placeholder!: string;
  @Input() label!: string;
  @Input() isDisabled: boolean = false;
  @Input() options: string[] = [];
  @Input() flags!: Array<{ imgUrl: string; value: string }>;
  @Input() myClass!: string;
  @Input() isReadOnly = false;
  @Input() filteredOptions!: Observable<any>;
  @Input() value!: string
  @Input() optionSelected!: (event: MatAutocompleteSelectedEvent) => void
  @Input() deleteFn!: (event: Event, option: Select) => void
  @ViewChild('telInput', { static: false }) telInput!: ElementRef;

  formControl!: FormControl;
  showPassword = false;
  onChange: OnChange<string> = () => {};
  onTouched: OnTouch = () => {};

  constructor(private destroyRef: DestroyRef, private store: Store) {}

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
  ngAfterViewInit(): void {
    if (this.telInput) {
      (<any>window).intlTelInput(this.telInput.nativeElement, {
        initialCountry: '',
        utilsScript:
          'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
      });
    }
  }
  displayFn(option: Select): string {
    console.log('displayed', option.name);
    
    return option && option.name ? option.name : ''
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
