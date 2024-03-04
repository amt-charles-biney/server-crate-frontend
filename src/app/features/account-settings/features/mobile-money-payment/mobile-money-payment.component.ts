import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  @Output() clearEmitter = new EventEmitter()
  mobileMoneyForm!: FormGroup;
  @ViewChild('telInput', { static: false }) telInput!: ElementRef;
  intl!: any;
  showWarning: string = '';
  ngOnInit(): void {
    this.mobileMoneyForm = new FormGroup({
      network: new FormControl('', Validators.required),
      contact: new FormControl(null, Validators.required),
      amount: new FormControl(this.amountToPay, Validators.required),
      reference: new FormControl('', Validators.required) //For testing
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

  clearForm() {
    this.mobileMoneyForm.reset({
      network: '',
      contact: {},
      reference: ''
    })
    this.intl.setNumber('')
    this.intl.setCountry('us');
    this.clearEmitter.emit()
  }

  getContact() {
    const contact = this.intl?.getSelectedCountryData();
    const contactValue: Contact = {
      country: contact.name,
      dialCode: contact.dialCode,
      iso2Code: contact.iso2,
      phoneNumber: this.intl?.getNumber(),
    };
    return contactValue
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
    const contactValue = this.getContact()
    this.contact?.setValue(contactValue);
  }

  get contact() {
    return this.mobileMoneyForm.get('contact');
  }
}
