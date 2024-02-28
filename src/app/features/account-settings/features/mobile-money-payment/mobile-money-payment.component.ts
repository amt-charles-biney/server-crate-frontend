import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Contact } from '../../../../types';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select.component';
import { CustomCheckBoxComponent } from '../../../../shared/components/custom-check-box/custom-check-box.component';

@Component({
  selector: 'app-mobile-money-payment',
  standalone: true,
  imports: [
    CommonModule,
    CustomInputComponent,
    CustomButtonComponent,
    ReactiveFormsModule,
    CustomSelectComponent,
    CustomCheckBoxComponent
  ],
  templateUrl: './mobile-money-payment.component.html',
})
export class MobileMoneyPaymentComponent implements OnInit, AfterViewInit {
  @Input() page: 'default' | 'checkout' = 'default';
  @Input() amountToPay: number = 0
  mobileMoneyForm!: FormGroup;
  @ViewChild('telInput', { static: false }) telInput!: ElementRef;
  intl!: any;
  showWarning: string = '';
  ngOnInit(): void {
    this.mobileMoneyForm = new FormGroup({
      network: new FormControl(''),
      contact: new FormControl(null),
      amount: new FormControl(this.amountToPay),
      reference: new FormControl('')
    });    
  }

  ngAfterViewInit(): void {
    if (this.telInput) {
      this.intl = (<any>window).intlTelInput(this.telInput.nativeElement, {
        initialCountry: '',
        utilsScript:
          'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
      });
    }
  }

  addWallet() {
    console.log('Valid number', this.intl.isValidNumber());
    if (!this.intl.isValidNumber()) {
      this.showWarning = 'Please enter a valid phone number';
      setTimeout(() => {
        this.showWarning = '';
      }, 3000);
      return;
    }
    const contact = this.intl?.getSelectedCountryData();
    const contactValue: Contact = {
      country: contact.name,
      dialCode: contact.dialCode,
      iso2Code: contact.iso2,
      phoneNumber: this.intl?.getNumber(),
    };
    this.contact?.setValue(contactValue);
  }

  get contact() {
    return this.mobileMoneyForm.get('contact');
  }
}
