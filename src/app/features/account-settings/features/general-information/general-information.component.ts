import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select.component';
import { saveChanges } from '../../../../core/utils/settings';
import intlTelInput from 'intl-tel-input';
import { Contact } from '../../../../types';


@Component({
  selector: 'app-general-information',
  standalone: true,
  imports: [CommonModule, CustomInputComponent, ReactiveFormsModule, CustomButtonComponent, CustomSelectComponent],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.scss'
})
export class GeneralInformationComponent implements OnInit, AfterViewInit {
  generalInfoForm!: FormGroup
  showWarning: string = ''
  @ViewChild('telInput', { static: false }) telInput!: ElementRef;
  intl!: any

  ngOnInit(): void {
    this.generalInfoForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl(null, [Validators.required]),
      gender: new FormControl(''),
    })
  }

  ngAfterViewInit(): void {
    if (this.telInput) {
      this.intl = intlTelInput(this.telInput.nativeElement, {
        initialCountry: '',
        utilsScript:
          'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
      });
    }
  }

  saveGeneralInfoChanges() {
    const contact = this.intl?.getSelectedCountryData()
    const contactValue: Contact = {
      country: contact.name,
      dialCode: contact.dialCode,
      iso2Code: contact.iso2,
      phoneNumber: this.intl?.getNumber()
    }
    console.log('Valid number', this.intl.isValidNumber());
    if (!this.intl.isValidNumber()) {
      this.showWarning = 'Please enter a valid phone number'
      setTimeout(() => {
        this.showWarning = ''
      }, 3000);
      return
    }
    this.contact?.setValue(contactValue)
    saveChanges(this.generalInfoForm)
  }

  get name() {
    return this.generalInfoForm.get('name')
  }

  get email() {
    return this.generalInfoForm.get('email')
  }

  get contact() {
    return this.generalInfoForm.get('contact')
  }
}
