import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TermsAndConditionsComponent } from '../../shared/components/terms-and-conditions/terms-and-conditions.component';
import { ResetPasswordComponent } from '../reset/reset-password/reset-password.component';
import { GeneralInformationComponent } from './features/general-information/general-information.component';
import { Router, RouterModule } from '@angular/router';
import { Link, Username } from '../../types';
import { UserProfileImageComponent } from '../../shared/components/user-profile-image/user-profile-image.component';
import { ProfileService } from '../../core/services/user-profile/profile.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    MatTabsModule,
    TermsAndConditionsComponent,
    ResetPasswordComponent,
    GeneralInformationComponent,
    RouterModule,
    UserProfileImageComponent,
    CommonModule,
  ],
  templateUrl: './account-settings.component.html',
})
export class AccountSettingsComponent implements OnInit {
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
    this.isAdmin = this.authService.isAdmin();
    if (this.router.url === '/settings') {
      this.router.navigateByUrl('/settings/general', { replaceUrl: true })
    }
    
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
        label: 'Orders',
        link: 'orders',
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

  
  /**
   * The function `onActiveChange` sets the active link based on a boolean value.
   * @param {boolean} isActiveChange - The `isActiveChange` indicates
   * whether the current route is active
   * @param {Link} link - The `link` provides the data for the current route
   */
  onActiveChange(isActiveChange: boolean, link: Link) {
    if (isActiveChange) {
      this.activeLink = link
    }
  }
}
