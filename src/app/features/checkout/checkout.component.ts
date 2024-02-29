import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  forwardRef,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { CommonModule } from '@angular/common';
import { CustomStepperComponent } from '../../shared/components/custom-stepper/custom-stepper.component';
import { CdkStepLabel, CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { CustomCheckBoxComponent } from '../../shared/components/custom-check-box/custom-check-box.component';
import { BehaviorSubject, tap } from 'rxjs';
import { CartProductItem, Contact, PaymentRequest } from '../../types';
import { Store } from '@ngrx/store';
import { selectConfiguredProducts } from '../../store/cart/cart.reducers';
import { SummaryComponent } from '../../shared/components/summary/summary.component';
import { PaymentDetailsComponent } from '../account-settings/features/payment-details/payment-details.component';
import { zipCodeValidator } from '../../core/utils/validators';
import { sendingPaymentRequest, verifyPayment } from '../../store/checkout/checkout.actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatStepperModule,
    ReactiveFormsModule,
    FormsModule,
    CustomInputComponent,
    CommonModule,
    CustomCheckBoxComponent,
    forwardRef(() => CustomStepperComponent),
    CdkStepperModule,
    CdkStepLabel,
    SummaryComponent,
    PaymentDetailsComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  showWarning: string = '';
  @ViewChild('telInput', { static: false }) telInput!: ElementRef;
  @ViewChild('cdkStepper') cdkStepper!: CdkStepper
  @ViewChild(PaymentDetailsComponent) paymentDetailsComponent!: PaymentDetailsComponent
  intl!: any;
  paymentComplete: boolean = false
  shippingForm = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    address1: ['', Validators.required],
    address2: [''],
    country: ['', Validators.required],
    state: ['', Validators.required],
    city: ['', Validators.required],
    zipCode: ['', [Validators.required, zipCodeValidator()]],
    contact: {},
  });
  private cartItems$ = new BehaviorSubject<CartProductItem[]>([]);
  cartItems = this.cartItems$.asObservable();
  amountToPay!: number;

  constructor(private _formBuilder: FormBuilder, private store: Store, private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    this.cartItems = this.store.select(selectConfiguredProducts)

    this.activatedRoute.queryParams.subscribe((params) => {
      const reference = params['reference']
      if (reference) {
        this.store.dispatch(verifyPayment({ reference }))
      }
    })
  }
  ngAfterViewInit(): void {
    if (this.telInput) {
      this.intl = (<any>window).intlTelInput(this.telInput.nativeElement, {
        nationalMode: true,
        utilsScript:
          'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
      });
    }
    console.log('Stpper', this.cdkStepper.linear);
    
  }
  getSubtotal(amountToPay: number) {
    this.amountToPay = amountToPay
    console.log('GetSubtotal', this.amountToPay);    
  }

  userDetails() {
    const contact = this.intl?.getSelectedCountryData()
    const contactValue: Contact = {
      country: contact.name,
      dialCode: contact.dialCode,
      iso2Code: contact.iso2,
      phoneNumber: this.intl?.getNumber()
    }
    
    
    this.shippingForm.patchValue({ contact: contactValue })
    if (this.shippingForm.controls['contact'].value && !this.intl.isValidNumber()) {
      this.showWarning = 'Please enter a valid phone number'
      setTimeout(() => {
        this.showWarning = ''
      }, 2000);
      return
    }
    console.log('Shippin details', this.shippingForm.value)
  }

  paymentDetails() {
    this.paymentDetailsComponent.shareForm()
    const { amount, reference } = this.paymentDetailsComponent.paymentForm
    const paymentRequest: PaymentRequest = {
      amount: amount!,
      channels: ['mobile_money'],
      email: this.shippingForm.value.email!,
      reference: reference!,
      currency: "GHS"
    }
    this.store.dispatch(sendingPaymentRequest(paymentRequest))

    console.log('Payment details');
    console.log('Checkout data', this.paymentDetailsComponent.paymentForm) 
    
  }

  next() {
    const selectedIndex = this.cdkStepper.selectedIndex
    if (selectedIndex === 0) {
      this.userDetails()
    } else if (selectedIndex === 1) {
      this.paymentDetails()
    }
    // console.log('Completed', this.cdkStepper.steps.get(selectedIndex)?.completed);
    
    this.cdkStepper.next()
  }
  previous() {
    this.cdkStepper.previous()
  }
}
