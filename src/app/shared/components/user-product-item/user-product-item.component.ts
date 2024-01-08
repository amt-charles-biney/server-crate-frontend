import { Component, Input } from '@angular/core';
import { ProductItem } from '../../../types';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-user-product-item',
  standalone: true,
  imports: [CurrencyPipe, NgOptimizedImage],
  templateUrl: './user-product-item.component.html',
})
export class UserProductItemComponent {
  @Input() product!: ProductItem
}
