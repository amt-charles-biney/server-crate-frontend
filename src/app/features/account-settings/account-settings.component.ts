import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TermsAndConditionsComponent } from '../../shared/components/terms-and-conditions/terms-and-conditions.component';
import { ResetPasswordComponent } from '../reset/reset-password/reset-password.component';
import { GeneralInformationComponent } from './features/general-information/general-information.component';
import { Router, RouterModule } from '@angular/router';
import { Link } from '../../types';
import { ProfileService } from '../../core/services/user-profile/profile.service';
import { UserProfileImageComponent } from '../../shared/components/user-profile-image/user-profile-image.component';
@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    MatTabsModule,
    TermsAndConditionsComponent,
    ResetPasswordComponent,
    GeneralInformationComponent,
    RouterModule,
    UserProfileImageComponent
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
})
export class AccountSettingsComponent implements OnInit {
  navLinks: Link[] = [];
  activeLink!: Link;
  firstName!: string
  lastName!: string
  constructor(private router: Router, private profileService: ProfileService) {}
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
    const { firstName, lastName } = this.profileService.getUsername()
    this.firstName = firstName
    this.lastName = lastName
  }
}
