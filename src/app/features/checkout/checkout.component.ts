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
import { CdkStepLabel, CdkStepperModule } from '@angular/cdk/stepper';
import { CustomCheckBoxComponent } from '../../shared/components/custom-check-box/custom-check-box.component';
import { BehaviorSubject, tap } from 'rxjs';
import { CartProductItem } from '../../types';
import { Store } from '@ngrx/store';
import { selectConfiguredProducts } from '../../store/cart/cart.reducers';
import { SummaryComponent } from '../../shared/components/summary/summary.component';
import { PaymentDetailsComponent } from '../account-settings/features/payment-details/payment-details.component';

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
    PaymentDetailsComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  showWarning: string = '';
  @ViewChild('telInput', { static: false }) telInput!: ElementRef;
  intl!: any;

  shippingForm = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address1: ['', Validators.required],
    address2: ['', Validators.required],
    country: ['', Validators.required],
    state: ['', Validators.required],
    city: ['', Validators.required],
    zipCode: ['', [Validators.required, Validators.maxLength(4)]],
    contact: [''],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  private cartItems$ = new BehaviorSubject<CartProductItem[]>([]);
  cartItems = this.cartItems$.asObservable();
  subTotal!: number;

  constructor(private _formBuilder: FormBuilder, private store: Store) {}
  ngOnInit(): void {
    this.cartItems = this.store.select(selectConfiguredProducts)
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
}
