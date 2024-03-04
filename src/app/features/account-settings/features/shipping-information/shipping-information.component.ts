import { Component, OnInit } from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { getShippingDetails, saveShippingDetails } from '../../../../store/account-settings/general-info/general-info.actions';
import { Observable, combineLatest, tap } from 'rxjs';
import { selectShippingDetailsState } from '../../../../store/account-settings/general-info/general-info.reducers';
import { ShippingPayload } from '../../../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipping-information',
  standalone: true,
  imports: [CustomInputComponent, CustomButtonComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './shipping-information.component.html',
})
export class ShippingInformationComponent implements OnInit {
  shippingForm!: FormGroup
  shippingInfoForm$!: Observable<ShippingPayload>
  constructor(private store: Store) {
    
  }
  ngOnInit(): void {
    this.store.dispatch(getShippingDetails())
    this.shippingForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      address1: new FormControl('', Validators.required),
      address2: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      zipCode: new FormControl('', Validators.required),
    })

    this.shippingInfoForm$ = this.store.select(selectShippingDetailsState).pipe(
      tap((shippingDetails) => {
        this.shippingForm.patchValue({...shippingDetails })
      })
    )
  }

  saveShippingDetails() {
    if (this.shippingForm.invalid) return ;
    this.store.dispatch(saveShippingDetails(this.shippingForm.value))
  }
  
}
