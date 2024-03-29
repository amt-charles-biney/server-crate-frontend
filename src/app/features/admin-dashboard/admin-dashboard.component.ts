import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { UserProfileImageComponent } from '../../shared/components/user-profile-image/user-profile-image.component';
import { Store } from '@ngrx/store';
import { getAttributes } from '../../store/category-management/attributes/attributes.actions';
import { clearStorage } from '../../core/utils/helpers';
import { getCases } from '../../store/case/case.actions';
import { LoaderComponent } from '../../core/components/loader/loader.component';
import { getNotifications } from '../../store/admin/products/notifications.actions';
import { Observable } from 'rxjs';
import { selectCount } from '../../store/admin/products/notifications.reducers';
import { MatBadgeModule } from '@angular/material/badge';
import { ClickOutsideDirective } from '../../shared/directives/click/click-outside.directive';
import { NotificationsComponent } from '../../shared/components/notifications/notifications.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    NgOptimizedImage,
    UserProfileImageComponent,
    RouterModule,
    CommonModule,
    LoaderComponent,
    MatBadgeModule,
    ClickOutsideDirective,
    NotificationsComponent,
    MatSidenavModule
  ],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav

  numberOfNotifications$!: Observable<number>;
  activeLink: string = 'Dashboard';
  showNotifications: boolean = false;
  showSearchBar = false
  constructor(private router: Router, private store: Store) {}
  ngOnInit(): void {
    this.store.dispatch(getAttributes());
    this.store.dispatch(getCases());
    this.store.dispatch(getNotifications());
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {        
        const routes = this.router.url.split('/')
        const currentActiveLink = routes[routes.length - 1]        
        this.activeLink = currentActiveLink[0].toUpperCase().concat(currentActiveLink.slice(1))
      }
    });
    

    this.numberOfNotifications$ = this.store.select(selectCount);
  }

  setAdminLink(link: string) {
    this.activeLink = link;
  }
  logout() {
    clearStorage();
    this.router.navigateByUrl('/login');
  }
}
