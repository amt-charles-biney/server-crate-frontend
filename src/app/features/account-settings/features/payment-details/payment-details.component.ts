import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MobileMoneyPaymentComponent } from '../mobile-money-payment/mobile-money-payment.component';
import { CreditCardPaymentComponent } from '../credit-card-payment/credit-card-payment.component';

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [MatTabsModule, MobileMoneyPaymentComponent, CreditCardPaymentComponent],
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.scss'
})
export class PaymentDetailsComponent {

}
