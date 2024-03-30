import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { getCartItems } from './store/cart/cart.actions';
import { CookieConsentComponent } from './features/cookie-consent/cookie-consent.component';
import { getWishlist } from './store/admin/products/categories.actions';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, CookieConsentComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(getCartItems());
    this.store.dispatch(getWishlist())
    const productsInStorage = sessionStorage.getItem("products")
    sessionStorage.setItem("search", JSON.stringify(""))
    if (productsInStorage) {
      sessionStorage.setItem("products", productsInStorage)
    } else {
      sessionStorage.setItem("products", JSON.stringify({}))
    }
  }
}
