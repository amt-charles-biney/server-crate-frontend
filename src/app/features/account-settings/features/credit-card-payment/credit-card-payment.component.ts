import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

@Component({
  selector: 'app-credit-card-payment',
  standalone: true,
  imports: [
    CustomInputComponent,
    ReactiveFormsModule,
    CustomButtonComponent,
    CommonModule,
    CustomRadioComponent,
    CustomCheckBoxComponent
  ],
  templateUrl: './credit-card-payment.component.html',
  styleUrl: './credit-card-payment.component.scss',
})
export class CreditCardPaymentComponent implements OnInit {
  @Input() page: string = 'default'
  @Output() clearEmitter = new EventEmitter()
  creditCardForm!: FormGroup;

  ngOnInit(): void {
    this.creditCardForm = new FormGroup({
      paymentMethod: new FormControl('visa', Validators.required),
      name: new FormControl('', Validators.required),
      cardNumber: new FormControl('', [Validators.required, Validators.maxLength(16), Validators.minLength(16), Validators.pattern("^[0-9]*$")]),
      securityCode: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(3), Validators.pattern("^[0-9]*$")]),
      month: new FormControl('', [
        Validators.required,
        Validators.maxLength(2),
        Validators.pattern("^[0-9]*$"),
      ]),
      year: new FormControl('', [
        Validators.required,
        Validators.maxLength(2),
        Validators.pattern("^[0-9]*$"),
      ]),
      creditCardReference: new FormControl('', Validators.required)

    });
  }

  addCard() {
    const { month, year, ...rest } = this.creditCardForm.value;
    const formData = { ...rest, expiration: `${month}/${year}` };
  }

  clearForm() {
    this.creditCardForm.reset({
      paymentMethod: 'visa',
      name: '',
      cardNumber: '',
      securityCode: '',
      month: '',
      year: '',
      creditCardReference: ''
    })
    this.clearEmitter.emit()
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
    return this.creditCardForm.get('month')
  }

  get year() {
    return this.creditCardForm.get('year')
  }
}
