import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductItemSubset } from '../../types';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { UserProductItemComponent } from '../../shared/components/user-product-item/user-product-item.component';
import { selectContent } from '../../store/admin/products/wishlist.reducers';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, UserProductItemComponent],
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit {
  private wishlist$ = new BehaviorSubject<ProductItemSubset[]>([])
  wishlist = this.wishlist$.asObservable()

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.wishlist = this.store.select(selectContent)
  }
}
