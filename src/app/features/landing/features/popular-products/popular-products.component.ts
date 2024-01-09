import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProductItem } from '../../../../types';
import KeenSlider, { KeenSliderInstance } from 'keen-slider'
import { ProductItemComponent } from '../../../../shared/components/product-item/product-item.component';
import { Store } from '@ngrx/store';
import { loadNewProducts } from '../../../../store/product/featured-product/featured-product.action';
import { Observable } from 'rxjs';
import { selectNewProducts } from '../../../../store/product/featured-product/featured-product.reducer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popular-products',
  standalone: true,
  imports: [ProductItemComponent, CommonModule],
  templateUrl: './popular-products.component.html',
  styleUrls: [
    "../../../../../../node_modules/keen-slider/keen-slider.min.css"
  ],
})
export class PopularProductsComponent {

  popularProducts$!: Observable<ProductItem[] | []>;
  popularProducts: ProductItem[] = []

  ngOnInit() {

    this.popularProducts$ = this.store.select(selectNewProducts)
    this.store.dispatch(loadNewProducts())

    this.popularProducts$.subscribe(v => this.popularProducts = v)
  }


  constructor(private store: Store) {}



}
