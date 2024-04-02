import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { UserProfileImageComponent } from '../../shared/components/user-profile-image/user-profile-image.component';
import { Store } from '@ngrx/store';
import { getAttributes } from '../../store/category-management/attributes/attributes.actions';
import { clearStorage } from '../../core/utils/helpers';
import { getCases } from '../../store/case/case.actions';
import { LoaderComponent } from '../../core/components/loader/loader.component';
import { getNotifications } from '../../store/admin/products/notifications.actions';
import { Observable, debounceTime, tap } from 'rxjs';
import { selectCount } from '../../store/admin/products/notifications.reducers';
import { MatBadgeModule } from '@angular/material/badge';
import { ClickOutsideDirective } from '../../shared/directives/click/click-outside.directive';
import { NotificationsComponent } from '../../shared/components/notifications/notifications.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getProducts } from '../../store/admin/products/categories.actions';

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
    MatSidenavModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  searchInput!: FormControl;

  numberOfNotifications$!: Observable<number>;
  activeLink: string = '';
  showNotifications: boolean = false;
  showSearchBar = false;
  constructor(
    private router: Router,
    private store: Store,
    private destroyRef: DestroyRef
  ) {}
  ngOnInit(): void {
    this.searchInput = new FormControl('');
    this.store.dispatch(getAttributes());
    this.store.dispatch(getCases());
    this.store.dispatch(getNotifications());
    this.activeLink = this.setTitle(this.router.url);
    if (this.router)
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationEnd) {                
        this.activeLink = this.setTitle(this.router.url);
        this.searchInput.setValue("")
      }
    });

    this.searchInput.valueChanges
      .pipe(
        debounceTime(900),
        tap((value) => {
          sessionStorage.setItem('search', JSON.stringify(value));
          if (this.activeLink === 'Products') {
            this.store.dispatch(getProducts({ page: 0 }));
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.numberOfNotifications$ = this.store.select(selectCount);
  }

  setAdminLink(link: string) {
    this.activeLink = link;
  }

  /**
   * Uses the url to extract a title 
   * @param url
   * @returns 
   */
  setTitle(url: string) {
    let title = '';
    const routes = url.split('admin/');    
    const possibleTitle = routes[routes.length - 1]
    
    if (possibleTitle.includes('/')) {
      title = possibleTitle.split('/')[0];
    } else if (possibleTitle.includes('?')){
      title = possibleTitle.split('?')[0]
    } else {
      title = possibleTitle;
    }

    return title[0].toUpperCase().concat(title.slice(1));
  }
  logout() {
    clearStorage();
    this.router.navigateByUrl('/login');
  }
}
