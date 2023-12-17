import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TermsAndConditionsComponent } from '../../shared/components/terms-and-conditions/terms-and-conditions.component';
import { ProfileElementComponent } from '../../shared/components/profile-element/profile-element.component';
import { ResetPasswordComponent } from '../reset/reset-password/reset-password.component';
import { GeneralInformationComponent } from './features/general-information/general-information.component';
import { PasswordInformationComponent } from './features/password-information/password-information.component';
import { RouterModule } from '@angular/router';
import { ShippingInformationComponent } from './features/shipping-information/shipping-information.component';
import { PaymentDetailsComponent } from './features/payment-details/payment-details.component';
import { PrivacyPolicyComponent } from '../../shared/components/privacy-policy/privacy-policy.component';
@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    MatTabsModule,
    TermsAndConditionsComponent,
    ProfileElementComponent,
    ResetPasswordComponent,
    GeneralInformationComponent,
    PasswordInformationComponent,
    ShippingInformationComponent,
    PaymentDetailsComponent,
    PrivacyPolicyComponent,
    RouterModule
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
})
export class AccountSettingsComponent {
  constructor() {
    sessionStorage.clear()
  }
}
