import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { saveChanges } from '../../../../core/utils/settings';
import { Contact } from '../../../../types';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select.component';

@Component({
  selector: 'app-mobile-money-payment',
  standalone: true,
  imports: [CommonModule, CustomInputComponent, CustomButtonComponent, ReactiveFormsModule, CustomSelectComponent],
  templateUrl: './mobile-money-payment.component.html',
  styleUrl: './mobile-money-payment.component.scss'
})
export class MobileMoneyPaymentComponent implements OnInit, AfterViewInit {
  mobileMoneyForm!: FormGroup
  @ViewChild('telInput', { static: false }) telInput!: ElementRef;
  intl!: any
  showWarning: string = ''
  ngOnInit(): void {
    this.mobileMoneyForm = new FormGroup({
      network: new FormControl(''),
      contact: new FormControl(null)
    })
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
      this.showWarning = 'Please enter a valid phone number'
      setTimeout(() => {
        this.showWarning = ''
      }, 3000);
      return
    }
    const contact = this.intl?.getSelectedCountryData()
    const contactValue: Contact = {
      country: contact.name,
      dialCode: contact.dialCode,
      iso2Code: contact.iso2,
      phoneNumber: this.intl?.getNumber()
    }
    this.contact?.setValue(contactValue)
    saveChanges(this.mobileMoneyForm)  
  }

  get contact() {
    return this.mobileMoneyForm.get('contact')
  }
}
