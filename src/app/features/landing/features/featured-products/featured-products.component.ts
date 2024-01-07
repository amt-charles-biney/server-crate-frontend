import { Component } from '@angular/core';
import { ProductItem } from '../../../../types';
import { CommonModule } from '@angular/common';
import { ProductItemComponent } from '../../../../shared/components/product-item/product-item.component';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, ProductItemComponent],
  templateUrl: './featured-products.component.html',
})
export class FeaturedProductsComponent {

  featuredProducts: ProductItem[] | any = [];

}
