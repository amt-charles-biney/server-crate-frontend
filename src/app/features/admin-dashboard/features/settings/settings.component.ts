import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Link, Username } from '../../../../types';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../../../core/services/user-profile/profile.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  navLinks: Link[] = [];
  activeLink!: Link;
  activeIndex: number = 0;
  name$!: Observable<Username>;
  isAdmin: boolean = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.router.navigateByUrl('/admin/settings/general', { replaceUrl: true })
    this.isAdmin = this.authService.isAdmin();
    this.navLinks = [
      {
        label: 'General',
        link: 'general',
      },
      {
        label: 'Password',
        link: 'password',
      },
      {
        label: 'Shipping',
        link: 'shipping',
      },
      {
        label: 'Payment',
        link: 'payment',
      },
      {
        label: 'Terms & Conditions',
        link: 'terms-conditions',
      },
      {
        label: 'Privacy Policy',
        link: 'privacy-policy',
      },
    ];
    this.activeLink = this.navLinks[this.activeIndex];    
    this.name$ = this.profileService.getUser();
  }

  onActiveChange(isActiveChange: boolean, link: Link) {
    if (isActiveChange) {
      this.activeLink = link
    }
  }
}
