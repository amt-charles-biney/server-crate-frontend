import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProductItemComponent } from '../../../../shared/components/product-item/product-item.component';
import { ProductItem } from '../../../../types';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { getProducts } from '../../../../store/admin/products/categories.actions';
import { BehaviorSubject } from 'rxjs';
import { selectProducts } from '../../../../store/admin/products/products.reducers';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductItemComponent, RouterModule, CommonModule],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsPageComponent implements OnInit {
  private products$ = new BehaviorSubject<ProductItem[]>([]);
  products = this.products$.asObservable();
  constructor(private store: Store) {}
  ngOnInit(): void {
    this.store.dispatch(getProducts());
    this.products = this.store.select(selectProducts);
  }
}
