import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductItem } from '../../../types';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-product-item',
  standalone: true,
  imports: [CurrencyPipe, NgOptimizedImage, CommonModule],
  templateUrl: './user-product-item.component.html',
})
export class UserProductItemComponent {
  @Input() product!: ProductItem;
  @Output() selectorEmitter = new EventEmitter<ProductItem>();
  isSelected: boolean = false;

  onSelect() {
    if (this.isSelected) {
      this.isSelected = false;
    } else {
      this.isSelected = true;
      this.selectorEmitter.emit(this.product);
    }
  }

  onNavigateToProduct(event: Event, id: string) {
    event.stopPropagation()
    this.router.navigate(['/product/configure', id], { replaceUrl: true });
  }

  constructor(private router: Router) {}
}
