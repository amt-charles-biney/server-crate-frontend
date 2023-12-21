import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TermsAndConditionsComponent } from '../../shared/components/terms-and-conditions/terms-and-conditions.component';
import { ProfileElementComponent } from '../../shared/components/profile-element/profile-element.component';
import { ResetPasswordComponent } from '../reset/reset-password/reset-password.component';
import { GeneralInformationComponent } from './features/general-information/general-information.component';
import { PasswordInformationComponent } from './features/password-information/password-information.component';
import { Router, RouterModule } from '@angular/router';
import { ShippingInformationComponent } from './features/shipping-information/shipping-information.component';
import { PaymentDetailsComponent } from './features/payment-details/payment-details.component';
import { PrivacyPolicyComponent } from '../../shared/components/privacy-policy/privacy-policy.component';
import { Link } from '../../types';
import { UserProfileImageComponent } from '../../shared/components/user-profile-image/user-profile-image.component';
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
    RouterModule,
    UserProfileImageComponent
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
})
export class AccountSettingsComponent implements OnInit {
  navLinks: Link[] = [];
  activeLink!: Link;

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.navLinks = [
      {
        label: 'General',
        link: 'general',
        index: 0,
      },
      {
        label: 'Password',
        link: 'password',
        index: 1,
      },
      {
        label: 'Shipping',
        link: 'shipping',
        index: 2,
      },
      {
        label: 'Payment',
        link: 'payment',
        index: 3,
      },
      {
        label: 'Terms & Conditions',
        link: 'terms-conditions',
        index: 4,
      },
      {
        label: 'Privacy Policy',
        link: 'privacy-policy',
        index: 5,
      },
    ];
    this.activeLink = this.navLinks[0];
    if (this.router.url !== '/settings/general') {
      this.router.navigateByUrl('/settings/general');
    }
  }
}
