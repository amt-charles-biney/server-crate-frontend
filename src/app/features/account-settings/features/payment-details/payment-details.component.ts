import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MobileMoneyPaymentComponent } from '../mobile-money-payment/mobile-money-payment.component';
import { CreditCardPaymentComponent } from '../credit-card-payment/credit-card-payment.component';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { PaymentForm } from '../../../../types';

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [MatTabsModule, MobileMoneyPaymentComponent, CreditCardPaymentComponent, CommonModule],
  templateUrl: './payment-details.component.html',
})
export class PaymentDetailsComponent {
  @Input() page: 'default' | 'checkout' = 'default'
  @Input() amountToPay: number = 0
  @ViewChild(MobileMoneyPaymentComponent) mobileMoneyComponent!: MobileMoneyPaymentComponent
  @ViewChild(CreditCardPaymentComponent) creditCardComponent!: CreditCardPaymentComponent
  paymentForm!: PaymentForm
  
  shareForm() {
    const { network, amount, reference } = this.mobileMoneyComponent.mobileMoneyForm.value
    const { name, cardNumber, securityCode, month, year, creditCardReference } = this.creditCardComponent.creditCardForm.value
    this.paymentForm = {
      amount,
      cardNumber,
      contact: this.mobileMoneyComponent.getContact(),
      expirationDate: `${month}/${year}`,
      name,
      network,
      reference,
      securityCode,
      creditCardReference, //For testing
    }
  }
}
