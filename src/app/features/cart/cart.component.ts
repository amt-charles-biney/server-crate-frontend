import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { deleteCartItem, getCartItems } from '../../store/cart/cart.actions';
import { BehaviorSubject, tap } from 'rxjs';
import { CartProductItem } from '../../types';
import { selectConfiguredProducts } from '../../store/cart/cart.reducers';
import { CommonModule } from '@angular/common';
import { CartProductItemComponent } from '../../shared/components/cart-product-item/cart-product-item.component';
import { RecommendedProductsComponent } from './features/recommended-products/recommended-products.component';
import { RouterModule } from '@angular/router';
import { SummaryComponent } from '../../shared/components/summary/summary.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CartProductItemComponent, RecommendedProductsComponent, RouterModule, SummaryComponent],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  private cartItems$ = new BehaviorSubject<CartProductItem[]>([])
  cartItems = this.cartItems$.asObservable()
  subTotal!: number
  constructor(private store: Store) {}
  ngOnInit(): void {
    this.cartItems = this.store.select(selectConfiguredProducts)
  }

  getQuantityOfProduct(quantity: number, cartItem: CartProductItem) {
  }
}
