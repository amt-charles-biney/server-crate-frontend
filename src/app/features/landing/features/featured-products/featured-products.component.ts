import { Component } from '@angular/core';
import { ProductItem } from '../../../../types';
import { CommonModule } from '@angular/common';
import { ProductItemComponent } from '../../../../shared/components/product-item/product-item.component';
import { Store } from '@ngrx/store';
import { selectFeaturedProducts, selectLoading } from '../../../../store/product/featured-product/featured-product.reducer';
import { loadFeaturedProducts } from '../../../../store/product/featured-product/featured-product.action';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, ProductItemComponent],
  templateUrl: './featured-products.component.html',
})
export class FeaturedProductsComponent {

  featuredProducts$!: Observable<ProductItem[] | []>;
  featuredProducts: ProductItem[] | [] = [];
  loading$!: Observable<boolean>;
  loading: boolean = false;


  ngOnInit() {
      this.featuredProducts$ = this.store.select(selectFeaturedProducts)
      this.loading$ = this.store.select(selectLoading)

      this.store.dispatch(loadFeaturedProducts())

      this.featuredProducts$.subscribe(v => this.featuredProducts = v)
      this.loading$.subscribe(v => this.loading = v)
  }

  constructor(private store: Store) {}

}
