import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { UserProfileImageComponent } from '../../../shared/components/user-profile-image/user-profile-image.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { BehaviorSubject, Observable, debounceTime, tap } from 'rxjs';
import { selectCount } from '../../../store/cart/cart.reducers';
import { MegaMenuComponent } from './mega-menu/mega-menu.component';
import { selectTotalElements } from '../../../store/admin/products/wishlist.reducers';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MegaMenuComponent,
    NgOptimizedImage,
    RouterModule,
    CustomButtonComponent,
    UserProfileImageComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  isMegaMenu: boolean = false;
  isAuthenticated!: boolean;
  showSearch: boolean = false;
  searchForm!: FormGroup;
  numberOfCartItems$!: Observable<number>;
  numberOfWishlistItems$!: Observable<number>;
  constructor(
    private authService: AuthService,
    private store: Store,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    this.isAuthenticated = this.authService.isAuthenticated();
  }
  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchValue: new FormControl('', Validators.required),
    });
    this.numberOfCartItems$ = this.store.select(selectCount);
    this.numberOfWishlistItems$ = this.store.select(selectTotalElements);
    this.searchValue.valueChanges
      .pipe(
        debounceTime(900),
        tap((value) => {
          if (value) {
            this.router.navigate(['/servers'], {
              queryParams: { query: `${value}` },
            });
          } else if (value === '') {
            this.router.navigate(['/servers'], { replaceUrl: true });
          }
          
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  openSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchForm.patchValue({ searchValue: '' })
    }
  }

  search() {
    if (this.searchForm.invalid) return;
    this.router.navigate(['/servers'], {
      queryParams: { query: `${this.searchValue.value}` },
    });
  }

  get searchValue() {
    return this.searchForm.get('searchValue')!;
  }

  toggleMenu(menuState: boolean) {
    this.isMegaMenu = menuState;
  }
}
