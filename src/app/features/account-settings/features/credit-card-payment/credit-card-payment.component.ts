import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { CommonModule } from '@angular/common';
import { CustomRadioComponent } from '../../../../shared/components/custom-radio/custom-radio.component';
import { CustomCheckBoxComponent } from '../../../../shared/components/custom-check-box/custom-check-box.component';
import { Observable, first, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  monthValidator,
  yearValidator,
} from '../../../../core/utils/validators';
import { isMasterCard, isVisaCard } from '../../../../core/utils/helpers';
import { Store } from '@ngrx/store';
import { CreditCard } from '../../../../types';
import {
  addCard,
  getCards,
} from '../../../../store/account-settings/general-info/general-info.actions';
import { selectCreditCards } from '../../../../store/account-settings/general-info/general-info.reducers';
import { CardListComponent } from '../../../../shared/components/card-list/card-list.component';

@Component({
  selector: 'app-credit-card-payment',
  standalone: true,
  imports: [
    CustomInputComponent,
    ReactiveFormsModule,
    CustomButtonComponent,
    CommonModule,
    CustomRadioComponent,
    CustomCheckBoxComponent,
    CardListComponent,
  ],
  templateUrl: './credit-card-payment.component.html',
  styleUrl: './credit-card-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardPaymentComponent implements OnInit {
  @Input() page: 'default' | 'checkout' = 'default';
  @Output() clearEmitter = new EventEmitter();
  @ViewChild('monthRef') monthRef!: ElementRef<HTMLInputElement>;
  @ViewChild('yearRef') yearRef!: ElementRef<HTMLInputElement>;
  creditCardForm!: FormGroup;
  cards!: Observable<CreditCard[]>;

  constructor(private destroyRef: DestroyRef, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(getCards());
    this.creditCardForm = new FormGroup({
      paymentMethod: new FormControl('visa', Validators.required),
      name: new FormControl('', Validators.required),
      cardNumber: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(16),
          Validators.minLength(16),
          Validators.pattern('^[0-9]*$'),
        ],
      }),
      securityCode: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(4),
          Validators.minLength(3),
          Validators.pattern('^[0-9]*$'),
        ],
      }),
      month: new FormControl('', {
        validators: [Validators.required, monthValidator()],
        updateOn: 'submit',
      }),
      year: new FormControl('', {
        validators: [Validators.required, yearValidator()],
        updateOn: 'submit',
      }),
      creditCardReference: new FormControl('', Validators.required),
    });

    this.cardNumber?.valueChanges
      .pipe(
        tap((value) => {
          if (isVisaCard(value[0])) {
            this.paymentMethod?.patchValue('visa');
          } else if (isMasterCard(value[0])) {
            this.paymentMethod?.patchValue('mastercard');
          } else {
            this.paymentMethod?.patchValue('');
            this.cardNumber?.setErrors({ 'card': 'Invalid Card'})
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.cards = this.store.select(selectCreditCards);
  }

  addCard() {
    console.log('Submit');

    this.creditCardForm.markAllAsTouched();
    if (this.creditCardForm.invalid) return;
    const { month, year, ...rest } = this.creditCardForm.value;
    const formData: CreditCard = {
      cardHolderName: rest.name,
      cardNumber: rest.cardNumber,
      expirationDate: `${month}/${year}`,
      paymentMethod: rest.paymentMethod,
    };
    this.store.dispatch(addCard(formData));
  }

  clearForm() {
    this.creditCardForm.reset({
      paymentMethod: 'visa',
      name: '',
      cardNumber: '',
      securityCode: '',
      month: '',
      year: '',
      creditCardReference: '',
    });
    this.clearEmitter.emit();
  }

  selectCard(card: CreditCard) {
    const [month, year] = card.expirationDate.split('/');
    this.creditCardForm.patchValue({
      name: card.cardHolderName,
      cardNumber: card.cardNumber,
      month,
      year,
    });
  }

  get paymentMethod() {
    return this.creditCardForm.get('paymentMethod');
  }

  get name() {
    return this.creditCardForm.get('name');
  }

  get cardNumber() {
    return this.creditCardForm.get('cardNumber');
  }

  get securityCode() {
    return this.creditCardForm.get('securityCode');
  }

  get month() {
    return this.creditCardForm.get('month');
  }

  get year() {
    return this.creditCardForm.get('year');
  }
}
