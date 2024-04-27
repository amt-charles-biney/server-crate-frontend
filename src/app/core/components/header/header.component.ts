import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { UserProfileImageComponent } from '../../../shared/components/user-profile-image/user-profile-image.component';
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
import { Observable, debounceTime, tap } from 'rxjs';
import { MegaMenuComponent } from './mega-menu/mega-menu.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartIconButtonComponent } from '../../../shared/components/cart-icon-button/cart-icon-button.component';
import { WishlistIconButtonComponent } from '../../../shared/components/wishlist-icon-button/wishlist-icon-button.component';

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
    CartIconButtonComponent,
    WishlistIconButtonComponent
  ],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @ViewChild('searchBar') searchBar!: ElementRef<HTMLInputElement>
  @Input() numberOfCartItems!: number
  @Input() numberOfWishlistItems!: number
  isMegaMenu: boolean = false;
  isAuthenticated!: boolean;
  showSearch: boolean = false;
  searchForm!: FormGroup;
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
  }

  openSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchForm.patchValue({ searchValue: '' })
      this.router.navigate([], {queryParams: {}})
    } else {
      setTimeout(() => {
        this.searchBar.nativeElement.focus()
      }, 0);
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
