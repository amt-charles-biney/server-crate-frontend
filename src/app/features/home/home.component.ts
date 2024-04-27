import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { MobileHeaderComponent } from '../../mobile/mobile-header/mobile-header.component';
import { Observable } from 'rxjs';
import { selectCount } from '../../store/cart/cart.reducers';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { selectTotalElements } from '../../store/admin/products/wishlist.reducers';
import { loadFeaturedProducts, loadNewProducts } from '../../store/product/featured-product/featured-product.action';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, FooterComponent, HeaderComponent, MobileHeaderComponent, CommonModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{
  numberOfCartItems$!: Observable<number>;
  numberOfWishlistItems$!: Observable<number>;

  constructor(
    private store: Store,
  ) {
  }
  ngOnInit(): void {
    this.numberOfCartItems$ = this.store.select(selectCount);
    this.numberOfWishlistItems$ = this.store.select(selectTotalElements);
    this.store.dispatch(loadFeaturedProducts());
    this.store.dispatch(loadNewProducts())
  }

}
