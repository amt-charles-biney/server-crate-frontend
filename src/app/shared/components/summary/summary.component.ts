import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartProductItem } from '../../../types';
import { Store } from '@ngrx/store';
import { selectConfiguredProducts } from '../../../store/cart/cart.reducers';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {
  @Input() cartItems!: Observable<CartProductItem[]>
  @Input() title!: string
  @Input() page!: 'cart' | 'checkout'
  subTotal!: number;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.cartItems = this.store.select(selectConfiguredProducts).pipe(
      tap((cartItems) => {
        this.subTotal = 0;
        cartItems.forEach((item) => {
          this.subTotal += item.totalPrice;
        });
      })
    );
  }
}
