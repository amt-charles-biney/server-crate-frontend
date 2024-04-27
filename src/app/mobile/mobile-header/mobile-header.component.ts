import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  NgZone,
  OnInit,
} from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { CartIconButtonComponent } from '../../shared/components/cart-icon-button/cart-icon-button.component';
import { WishlistIconButtonComponent } from '../../shared/components/wishlist-icon-button/wishlist-icon-button.component';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuComponent } from '../../shared/components/menu/menu.component';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [
    MatBadgeModule,
    CartIconButtonComponent,
    WishlistIconButtonComponent,
    ReactiveFormsModule,
    MenuComponent
  ],
  templateUrl: './mobile-header.component.html',
})
export class MobileHeaderComponent implements OnInit {
  @ViewChild('searchBar') searchBar!: ElementRef<HTMLInputElement>;

  @Input() numberOfCartItems!: number;
  @Input() numberOfWishlistItems!: number;

  searchIsVisible: boolean = false;
  menuIsOpen: boolean = false;


  searchForm!: FormGroup;


  constructor(private ngZone: NgZone, private router: Router) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchValue: new FormControl('', Validators.required),
    });
  }
  openSearchBar(event: Event) {
    event.stopPropagation()
    this.searchIsVisible = !this.searchIsVisible;

    if (this.searchIsVisible) {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.searchBar.nativeElement.focus();
        }, 0);
      })
    }
  }

  onClickOverlay(event: Event) {
    event.stopPropagation()
    this.searchIsVisible = false
  }

  search() {
    if (this.searchForm.invalid) return;    
    this.router.navigate(['/servers'], {
      queryParams: { query: `${this.searchValue.value}` },
    });
    this.searchIsVisible = false
    this.searchForm.reset()
  }

  openMenu() {
    this.menuIsOpen = !this.menuIsOpen;
  }

  goToLandingPage() {
    this.router.navigate(['/'], { replaceUrl: true });
    this.menuIsOpen = false;
  }

  get searchValue() {
    return this.searchForm.get('searchValue')!
  }
}
