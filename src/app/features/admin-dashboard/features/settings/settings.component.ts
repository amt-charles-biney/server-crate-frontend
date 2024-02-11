import { Component } from '@angular/core';
import { Link, Username } from '../../../../types';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../../../core/services/user-profile/profile.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CURRENT_AD_INDEX } from '../../../../core/utils/constants';
import { MatTabsModule } from '@angular/material/tabs';
import { TermsAndConditionsComponent } from '../../../../shared/components/terms-and-conditions/terms-and-conditions.component';
import { ResetPasswordComponent } from '../../../reset/reset-password/reset-password.component';
import { GeneralInformationComponent } from '../../../account-settings/features/general-information/general-information.component';
import { PasswordInformationComponent } from '../../../account-settings/features/password-information/password-information.component';
import { ShippingInformationComponent } from '../../../account-settings/features/shipping-information/shipping-information.component';
import { PaymentDetailsComponent } from '../../../account-settings/features/payment-details/payment-details.component';
import { PrivacyPolicyComponent } from '../../../../shared/components/privacy-policy/privacy-policy.component';
import { UserProfileImageComponent } from '../../../../shared/components/user-profile-image/user-profile-image.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatTabsModule,
    TermsAndConditionsComponent,
    ResetPasswordComponent,
    GeneralInformationComponent,
    PasswordInformationComponent,
    ShippingInformationComponent,
    PaymentDetailsComponent,
    PrivacyPolicyComponent,
    RouterModule,
    UserProfileImageComponent,
    CommonModule,
  ],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  navLinks: Link[] = [];
  activeLink!: Link;
  activeIndex: number = 0;
  name$!: Observable<Username>;
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
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
    this.activeIndex = Number(sessionStorage.getItem(CURRENT_AD_INDEX)) || 0;
    this.activeLink = this.navLinks[this.activeIndex];
    // this.router.navigateByUrl(`/settings/${this.navLinks[this.activeIndex].link}`);    
    this.name$ = this.profileService.getUser();
  }
  ngOnDestroy(): void {
    sessionStorage.removeItem(CURRENT_AD_INDEX);
  }

  setCurrentIndex(link: Link) {
    this.activeLink = link;
    sessionStorage.setItem(CURRENT_AD_INDEX, link.index.toString());
  }
}
