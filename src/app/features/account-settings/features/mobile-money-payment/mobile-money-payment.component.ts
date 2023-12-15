import { Component, OnInit } from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { saveChanges } from '../../../../core/utils/settings';

@Component({
  selector: 'app-mobile-money-payment',
  standalone: true,
  imports: [CustomInputComponent, CustomButtonComponent, ReactiveFormsModule],
  templateUrl: './mobile-money-payment.component.html',
  styleUrl: './mobile-money-payment.component.scss'
})
export class MobileMoneyPaymentComponent implements OnInit {
  mobileMoneyForm!: FormGroup

  ngOnInit(): void {
    this.mobileMoneyForm = new FormGroup({
      network: new FormControl(''),
      contact: new FormControl(null)
    })
  }

  addWallet() {
    saveChanges(this.mobileMoneyForm)  
  }


}
