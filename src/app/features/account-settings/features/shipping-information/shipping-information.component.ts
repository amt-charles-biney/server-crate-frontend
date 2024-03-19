import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { getShippingDetails, saveShippingDetails } from '../../../../store/account-settings/general-info/general-info.actions';
import { Observable, tap } from 'rxjs';
import { selectShippingDetailsState } from '../../../../store/account-settings/general-info/general-info.reducers';
import { Address, Contact, ShippingPayload } from '../../../../types';
import { CommonModule } from '@angular/common';
import { zipCodeValidator } from '../../../../core/utils/validators';
import { AddressComponent } from '../../../../shared/components/address/address.component';

@Component({
  selector: 'app-shipping-information',
  standalone: true,
  imports: [CustomInputComponent, CustomButtonComponent, ReactiveFormsModule, CommonModule, AddressComponent],
  templateUrl: './shipping-information.component.html',
})
export class ShippingInformationComponent implements OnInit {
  shippingForm!: FormGroup
  shippingInfoForm$!: Observable<ShippingPayload>
  @ViewChild('telInput', { static: false }) telInput!: ElementRef;
  intl!: any;
  showWarning: string = '';

  constructor(private store: Store) {
    
  }
  ngOnInit(): void {
    this.store.dispatch(getShippingDetails())
    this.shippingForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl(''),
      address1: new FormControl('', Validators.required),
      address2: new FormControl(null),
      country: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      zipCode: new FormControl('', [Validators.required, zipCodeValidator()]),
      contact: new FormControl({}),
    })

    this.shippingInfoForm$ = this.store.select(selectShippingDetailsState).pipe(
      tap((shippingDetails) => {
        this.shippingForm.patchValue({...shippingDetails })
        this.intl?.setNumber(shippingDetails.contact?.phoneNumber)
      })
    )
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

  saveShippingDetails() {
    this.shippingForm.markAllAsTouched()
    if (this.shippingForm.invalid) return ;
    const contact = this.intl?.getSelectedCountryData();
    const contactValue: Contact = {
      country: contact.name,
      dialCode: contact.dialCode,
      iso2Code: contact.iso2,
      phoneNumber: this.intl?.getNumber(),
    };
    this.shippingForm.patchValue({ contact: contactValue, address2: this.shippingForm.value.address2 || null })    
    this.store.dispatch(saveShippingDetails(this.shippingForm.value))
  }

  getAddress(address: Address) {
    console.log("Address", address)
    this.shippingForm.patchValue({...address, address1: address.address})
  }
  
}
