import { Component, Input, OnInit } from '@angular/core';
import { ProductItem } from '../../../types';
import { CurrencyPipe, NgOptimizedImage, PercentPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CurrencyPipe, NgOptimizedImage, PercentPipe, RouterModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {
  @Input() product!: ProductItem
  
  // ngOnInit(): void {    
  //   const modifiedUrl = this.product.imageUrl[0].replace(/^http:\/\/res\.cloudinary\.com\/dqtxt1g06\/image\/upload\//, '');
  //   console.log('Modified url', modifiedUrl);
    
  //   this.product = {
  //     ...this.product,
  //     imageUrl: modifiedUrl
  //   }
  // }
}
