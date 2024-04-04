import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartProductItem } from '../../../types';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Store } from '@ngrx/store';
import { decreaseQuantity, deleteCartItem, increaseQuantity } from '../../../store/cart/cart.actions';
import { CloudinaryUrlPipe } from '../../pipes/cloudinary-url/cloudinary-url.pipe';

@Component({
  selector: 'app-cart-product-item',
  standalone: true,
  imports: [NgOptimizedImage, CurrencyPipe, CommonModule, CloudinaryUrlPipe],
  templateUrl: './cart-product-item.component.html',
  styleUrl: './cart-product-item.component.scss'
})
export class CartProductItemComponent implements OnInit {
  @Input() product!: CartProductItem;
  @Input() limit !: number
  @Output() quantityEmitter = new EventEmitter<number>();
  quantity!: number
  constructor(private store: Store){}
  
  ngOnInit(): void {
    this.quantity = this.product.quantity
  }
  deleteCartItem(id: string) {
    this.store.dispatch(deleteCartItem({ id }))
  }

  incrementQuantity() {
    if (this.quantity < this.limit) {
      this.quantity++
      this.quantityEmitter.emit(this.quantity)
      this.store.dispatch(increaseQuantity({configuredProductId: this.product.id, quantity: this.quantity}))
    }
  }
  
  decrementQuantity() {
    if (this.quantity === 1) return;
    this.quantity -= 1
    this.quantityEmitter.emit(this.quantity)
    this.store.dispatch(decreaseQuantity({configuredProductId: this.product.id, quantity: this.quantity}))
  }
}
