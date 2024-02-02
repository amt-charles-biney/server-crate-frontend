import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserProfileImageComponent } from '../../shared/components/user-profile-image/user-profile-image.component';
import { Store } from '@ngrx/store';
import { getAttributes } from '../../store/category-management/attributes/attributes.actions';
import { CURRENT_AD_TAB } from '../../core/utils/constants';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgOptimizedImage, UserProfileImageComponent, RouterModule, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  activeLink: string = ''
  constructor(private router: Router, private store: Store) {}
  ngOnInit(): void {
    this.store.dispatch(getAttributes());
    this.activeLink = sessionStorage.getItem(CURRENT_AD_TAB) || 'Dashboard'
  }
  ngOnDestroy(): void {
    sessionStorage.removeItem(CURRENT_AD_TAB)
  }

  setCurrentTab(currentTab: string) {
    sessionStorage.setItem(CURRENT_AD_TAB, currentTab)
    this.activeLink = currentTab
  }
  setAdminLink() {
    this.activeLink = 'Settings'
  }
  logout() {
    localStorage.clear()
    this.router.navigateByUrl('/login')
  }
}
