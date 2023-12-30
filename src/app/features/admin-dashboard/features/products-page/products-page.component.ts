import { Component, OnInit } from '@angular/core';
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
})
export class ProductsPageComponent implements OnInit {
  // product: ProductItem = {
  //   brand: 'Proliant DL385 G10 Plus',
  //    imageUrl: '/assets/server.svg',
  //    inStock: 200,
  //    productName: 'HPE P39123-Server',
  //    productPrice: '2000',
  //    sales: 11.01,
  // }
  private products$ = new BehaviorSubject<ProductItem[]>([]);
  products = this.products$.asObservable();
  constructor(private store: Store, private router: Router) {}
  ngOnInit(): void {
    this.store.dispatch(getProducts());
    this.products = this.store.select(selectProducts);
  }
}
