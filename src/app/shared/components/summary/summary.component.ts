import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartProductItem, SummarySubset } from '../../../types';
import { Store } from '@ngrx/store';
import { selectConfiguredProducts } from '../../../store/cart/cart.reducers';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { getCartItems } from '../../../store/cart/cart.actions';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent implements OnInit, OnChanges {
  @Input() cartItem!: SummarySubset
  @Input() quantity!: number
  @Input() title!: string
  @Input() page!: 'cart' | 'checkout' | 'details'
  @Output() subTotalEmitter = new EventEmitter<number>()
  subTotal!: number;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {    
    if (this.cartItem) {      
      this.quantity = this.cartItem.quantity
      this.subTotal = this.cartItem.totalPrice * this.quantity
      this.subTotalEmitter.emit(this.subTotal)    
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['quantity'] && changes['quantity'].currentValue) {
      this.subTotal = this.cartItem.totalPrice * changes['quantity'].currentValue
    }
    if (changes['cartItem'] && changes['cartItem'].currentValue){
      this.quantity = changes['cartItem'].currentValue.quantity
      this.subTotal = this.cartItem.totalPrice * this.quantity
    }
    this.subTotalEmitter.emit(this.subTotal)
  }

  goToCheckout() {
    this.store.dispatch(getCartItems())
    this.router.navigate(['/checkout'])
  }
  
}
