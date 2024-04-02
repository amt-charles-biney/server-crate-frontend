import {
  Component,
  DestroyRef,
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
import {
  CdkStepLabel,
  CdkStepper,
  CdkStepperModule,
} from '@angular/cdk/stepper';
import { CustomCheckBoxComponent } from '../../shared/components/custom-check-box/custom-check-box.component';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  Address,
  CartProductItem,
  Contact,
  LoadingStatus,
  PaymentRequest,
  PaymentVerification,
  ShippingPayload,
} from '../../types';
import { Store } from '@ngrx/store';
import { selectConfiguredProducts } from '../../store/cart/cart.reducers';
import { SummaryComponent } from '../../shared/components/summary/summary.component';
import { PaymentDetailsComponent } from '../account-settings/features/payment-details/payment-details.component';
import { zipCodeValidator } from '../../core/utils/validators';
import {
  sendingPaymentRequest,
  validationFailure,
  verifyPayment,
} from '../../store/checkout/checkout.actions';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  selectAddressValidationState,
  selectVerificationState,
} from '../../store/checkout/checkout.reducers';
import {
  getShippingDetails,
  saveShippingDetails,
} from '../../store/account-settings/general-info/general-info.actions';
import { selectShippingDetailsState } from '../../store/account-settings/general-info/general-info.reducers';
import { selectLoaderState } from '../../store/loader/reducers/loader.reducers';
import { LoaderComponent } from '../../core/components/loader/loader.component';
import { ErrorComponent } from '../../shared/components/error/error.component';
import { getCartItems } from '../../store/cart/cart.actions';
import { AddressComponent } from '../../shared/components/address/address.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth/auth.service';

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
    LoaderComponent,
    ErrorComponent,
    AddressComponent,
    RouterLink,
  ],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  showWarning: string = '';
  @ViewChild('telInput', { static: false }) telInput!: ElementRef;
  @ViewChild('cdkStepper') cdkStepper!: CdkStepper;
  @ViewChild(PaymentDetailsComponent)
  paymentDetailsComponent!: PaymentDetailsComponent;
  intl!: any;
  paymentComplete: boolean = false;
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
    contact: {
      country: '',
      dialCode: '',
      iso2Code: '',
      phoneNumber: '',
    },
  });
  shippingInfoForm$!: Observable<ShippingPayload>;

  private cartItems$ = new BehaviorSubject<CartProductItem[]>([]);
  cartItems = this.cartItems$.asObservable();
  verification$!: Observable<PaymentVerification>;
  verification!: PaymentVerification;
  amountToPay!: number;
  isVerified = false;
  stepIndex!: number;
  loadingStatus!: Observable<LoadingStatus>;
  addressVerified: boolean = false
  loaderText!: string ;
  constructor(
    private _formBuilder: FormBuilder,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.store.dispatch(getShippingDetails());
    }
    this.cartItems = this.store.select(selectConfiguredProducts);

    this.activatedRoute.queryParams.subscribe((params) => {
      const reference = params['reference'];
      if (reference) {
        this.store.dispatch(verifyPayment({ reference }));
        this.loaderText = 'Verifying payment...';
        this.verification$ = this.store.select(selectVerificationState).pipe(
          tap((verification) => {
            if (verification.status === 200) {
              this.cdkStepper.linear = false;
              this.cdkStepper.selectedIndex = 2;
              this.router.navigateByUrl('/checkout', { replaceUrl: true });
              this.store.dispatch(getCartItems());
            }
          })
        );
      }
    });

    this.shippingInfoForm$ = this.store.select(selectShippingDetailsState).pipe(
      tap((shippingDetails) => {
        this.shippingForm.patchValue({ ...shippingDetails });
        this.intl?.setNumber(shippingDetails.contact?.phoneNumber);
      })
    );
    this.loadingStatus = this.store.select(selectLoaderState).pipe(
      tap((value) => {
       console.log("Loader", value) 
      })
    )
    this.contact.valueChanges
      .pipe(
        tap(() => {
          this.showWarning = '';
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
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
  getSubtotal(amountToPay: number) {
    this.amountToPay = amountToPay;
  }

  getAddress(address: Address) {
    this.shippingForm.patchValue({ ...address, address1: address.address });
  }

  userDetails() {
    const contact = this.intl?.getSelectedCountryData();
    const contactValue: Contact = {
      country: contact.name,
      dialCode: contact.dialCode,
      iso2Code: contact.iso2,
      phoneNumber: this.intl?.getNumber(),
    };

    this.shippingForm.patchValue({ contact: contactValue });
    this.shippingForm.markAllAsTouched();
    if (!this.intl.isValidNumber()) {
      this.showWarning = 'Please enter a valid phone number';
      return;
    }
  }

  paymentDetails() {
    this.paymentDetailsComponent.shareForm();
    if (this.paymentDetailsComponent.currentIndex === 2) {
      const paymentRequest: PaymentRequest = {
        amount: this.paymentDetailsComponent.payStack.amount!,
        channels: ['card', 'mobile_money'],
        email: this.shippingForm.value.email!,
        reference: Date.now().toString(),
        currency: 'GHS',
      };
      this.store.dispatch(sendingPaymentRequest(paymentRequest));
    }
    if (!this.paymentDetailsComponent.paymentForm) return;
    const { amount, reference, creditCardReference, activeIndex } =
      this.paymentDetailsComponent.paymentForm;
    if (amount) {
      const paymentRequest: PaymentRequest = {
        amount: amount!,
        channels:
          activeIndex === 0
            ? ['card']
            : activeIndex === 1
            ? ['mobile_money']
            : ['card', 'mobile_money'],
        email: this.shippingForm.value.email!,
        reference: activeIndex === 0 ? creditCardReference! : reference!,
        currency: 'GHS',
      };
      this.store.dispatch(sendingPaymentRequest(paymentRequest));
    }
  }

  clearShippingForm() {
    this.shippingForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      address1: '',
      address2: '',
      country: '',
      state: '',
      city: '',
      zipCode: '',
      contact: {
        country: '',
        dialCode: '',
        iso2Code: '',
        phoneNumber: '',
      },
    });
    this.intl.setNumber('');
    this.intl.setCountry('us');
  }
  next() {
    const selectedIndex = this.cdkStepper.selectedIndex;
    if (selectedIndex === 0) {
      this.userDetails();
      this.loaderText = "Verifying user address"
      console.log('Shipping details', this.shippingForm.value);
      const {
        address1,
        address2,
        city,
        contact,
        country,
        email,
        firstName,
        lastName,
        state,
        zipCode,
      } = this.shippingForm.value;
      if (contact) {
        const contactValue: Contact = {
          country: contact.country,
          dialCode: contact.dialCode,
          iso2Code: contact.iso2Code,
          phoneNumber: this.intl?.getNumber(),
        };
        this.store.dispatch(
          saveShippingDetails({ shippingPayload: {
            address1: address1!,
            address2: address2!,
            city: city!,
            contact: contactValue,
            country: country!,
            email: email!,
            firstName: firstName!,
            lastName: lastName!,
            state: state!,
            zipCode: zipCode!,
          }, isProfile: false })
        );
      }
      this.store.select(selectAddressValidationState).pipe(
        tap((isVerified) => {
          console.log('isVerified', isVerified);
          this.addressVerified = isVerified
          if (this.addressVerified) {
            this.cdkStepper.next();
            this.store.dispatch(validationFailure())
          }
          this.addressVerified = false
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe()
    } else if (selectedIndex === 1) {
      this.paymentDetails();
      this.loaderText = 'Redirecting to PayStack...'
    }
  }
  previous() {
    this.cdkStepper.previous();
  }

  get contact() {
    return this.shippingForm.get('contact')!;
  }
}
