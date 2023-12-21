import { Component, Input } from '@angular/core';
import { ProductItem } from '../../../types';
import { CurrencyPipe, NgOptimizedImage, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CurrencyPipe, NgOptimizedImage, PercentPipe],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {
  @Input() product!: ProductItem

}
