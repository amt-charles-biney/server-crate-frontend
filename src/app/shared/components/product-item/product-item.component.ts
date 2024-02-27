import { Component, Input, OnInit } from '@angular/core';
import { ProductItem } from '../../../types';
import {
  CommonModule,
  CurrencyPipe,
  NgOptimizedImage,
  PercentPipe,
} from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import {
  addToFeature,
  removeFromFeature,
} from '../../../store/admin/products/categories.actions';
import { CloudinaryUrlPipe } from '../../pipes/cloudinary-url/cloudinary-url.pipe';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgOptimizedImage,
    PercentPipe,
    RouterModule,
    MatTooltipModule,
    CommonModule,
    CloudinaryUrlPipe
  ],
  templateUrl: './product-item.component.html',
})
export class ProductItemComponent implements OnInit {
  @Input() product!: ProductItem;
  @Input() page!: number;
  isFeatured: boolean = false;
  notification!: string;
  constructor(private store: Store) {}
  ngOnInit(): void {
    this.isFeatured = this.product.isFeatured;
    this.notification =
      this.product.stockStatus !== 'Available'
        ? this.product.stockStatus
        : this.product.category.name === 'unassigned'
        ? 'Unassigned Category'
        : '';
  }
  featureEvent(id: string) {
    if (this.isFeatured) {
      this.store.dispatch(removeFromFeature({ id }));
      this.isFeatured = false;
    } else {
      this.store.dispatch(addToFeature({ id }));
      this.isFeatured = true;
    }
  }
}
