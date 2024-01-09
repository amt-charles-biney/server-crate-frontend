import { Component, Input } from '@angular/core';
import { ProductItem } from '../../../types';
import { CurrencyPipe, NgOptimizedImage, PercentPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage-product-item',
  standalone: true,
  imports: [CurrencyPipe, NgOptimizedImage, PercentPipe, RouterModule],
  templateUrl: './homepage-product-item.component.html',
  styleUrl: './homepage-product-item.component.scss'
})
export class HomepageProductItemComponent {
  @Input() product!: ProductItem
}
