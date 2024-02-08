import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartProductItem } from '../../../types';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Store } from '@ngrx/store';
import { deleteCartItem } from '../../../store/cart/cart.actions';

@Component({
  selector: 'app-cart-product-item',
  standalone: true,
  imports: [NgOptimizedImage, CurrencyPipe, CommonModule],
  templateUrl: './cart-product-item.component.html',
  styleUrl: './cart-product-item.component.scss'
})
export class CartProductItemComponent {
  @Input() product!: CartProductItem;
  @Output() quantityEmitter = new EventEmitter<number>();
  quantity: number = 1
  constructor(private store: Store){}
  deleteCartItem(id: string) {
    this.store.dispatch(deleteCartItem({ id }))
  }

  incrementQuantity() {
    this.quantity += 1
    this.quantityEmitter.emit(this.quantity)
  }
  
  decrementQuantity() {
    if (this.quantity === 0) return;
    this.quantity -= 1
    this.quantityEmitter.emit(this.quantity)
  }
}
