import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { CURRENT_INDEX } from '../../core/utils/constants';
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
export class AccountSettingsComponent implements OnInit, OnDestroy {
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
    this.activeIndex = Number(sessionStorage.getItem(CURRENT_INDEX)) || 0;
    this.activeLink = this.navLinks[this.activeIndex];
    this.router.navigateByUrl(`/settings/${this.navLinks[this.activeIndex].link}`);    
    this.name$ = this.profileService.getUser();
  }
  ngOnDestroy(): void {
    sessionStorage.removeItem(CURRENT_INDEX);
  }

  setCurrentIndex(link: Link) {
    this.activeLink = link;
    sessionStorage.setItem(CURRENT_INDEX, link.index.toString());
  }
}
