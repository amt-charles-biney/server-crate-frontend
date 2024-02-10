import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { Contact, LoadingStatus } from '../../../../types';
import { Store } from '@ngrx/store';
import { changeNumber, getGeneralInfo } from '../../../../store/account-settings/general-info/general-info.actions';
import { selectContact, selectEmail, selectFirstName, selectLastName } from '../../../../store/account-settings/general-info/general-info.reducers';
import { Observable, Subject, combineLatest, map } from 'rxjs';
import { AuthLoaderComponent } from '../../../../shared/components/auth-loader/auth-loader.component';
import { selectLoaderState } from '../../../../store/loader/reducers/loader.reducers';
import { ProfileService } from '../../../../core/services/user-profile/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-information',
  standalone: true,
  imports: [AuthLoaderComponent, CommonModule, CustomInputComponent, ReactiveFormsModule, CustomButtonComponent],
  templateUrl: './general-information.component.html',
})
export class GeneralInformationComponent implements OnInit, AfterViewInit {
  generalInfoForm!: FormGroup
  showWarning: string = ''
  private generalForm$ = new Subject()
  generalForm = this.generalForm$.asObservable()
  @ViewChild('telInput', { static: false }) telInput!: ElementRef;
  intl!: any
  loadingState$!: Observable<LoadingStatus>
  constructor(private store: Store, private profileService: ProfileService) {
    this.store.dispatch(getGeneralInfo())
  }

  ngOnInit(): void {
    this.generalInfoForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl('', [Validators.required]),
    })
    this.generalForm = combineLatest([
      this.store.select(selectFirstName),
      this.store.select(selectLastName),
      this.store.select(selectEmail),
      this.store.select(selectContact)
    ]).pipe(map(([firstName, lastName, email, contact]: [firstName: string, lastName: string, email: string, contact: Contact]) => {
      let contactValue = ''
      if (contact && contact.phoneNumber) {
        contactValue = contact.phoneNumber
      }
      this.generalInfoForm.setValue({ firstName, lastName, email, contact: contactValue })
      this.intl?.setNumber(contactValue)
    }))
    this.loadingState$ = this.store.select(selectLoaderState)
    
  }

  ngAfterViewInit(): void {
    if (this.telInput) {      
      this.intl = (<any>window).intlTelInput(this.telInput.nativeElement, {
        nationalMode: true,
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
    if (!this.intl.isValidNumber()) {
      this.showWarning = 'Please enter a valid phone number'
      setTimeout(() => {
        this.showWarning = ''
      }, 2000);
      return
    }
    const { firstName, lastName } = this.generalInfoForm.value
    this.profileService.setUser({ firstName, lastName })
    this.store.dispatch(changeNumber({ contact: contactValue, firstName, lastName }))
  }

  get firstName() {
    return this.generalInfoForm.get('firstName')
  }
  get lastName() {
    return this.generalInfoForm.get('lastName')
  }

  get email() {
    return this.generalInfoForm.get('email')
  }

  get contact() {
    return this.generalInfoForm.get('contact')
  }
}
