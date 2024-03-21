import { Component, Input } from '@angular/core';
import { ProductItemSubset } from '../../../types';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { CloudinaryUrlPipe } from '../../pipes/cloudinary-url/cloudinary-url.pipe';
import { BuyNowComponent } from './features/buy-now/buy-now.component';
import { Store } from '@ngrx/store';
import { addToWishlist } from '../../../store/admin/products/categories.actions';

@Component({
  selector: 'app-user-product-item',
  standalone: true,
  imports: [
    CurrencyPipe,
    // BuyNowComponent,
    NgOptimizedImage,
    CommonModule,
    CloudinaryUrlPipe,
  ],
  templateUrl: './user-product-item.component.html',
})
export class UserProductItemComponent {
  @Input() product!: ProductItemSubset;
  @Input() isGrid: boolean = true;
  isSelected: boolean = false;

  // buyNow() {
  //   this.dialog.open(BuyNowComponent, {
  //     height: '80%',
  //     width: '70%',
  //   });
  // }

  onNavigateToProduct(event: Event, id: string) {
    event.stopPropagation();
    this.router.navigate(['/product/configure', id]);
  }

  addToWishlist(id: string) {
    this.store.dispatch(addToWishlist({ id }));
  }

  addToCompare(product: ProductItemSubset) {
    let productsForComparison:ProductItemSubset[] = [product];
    if (localStorage.getItem("products")) {
      const productsInStorage = JSON.parse(localStorage.getItem("products")!)
    productsForComparison = [...productsInStorage, product]
    }

    localStorage.setItem('products', JSON.stringify(productsForComparison)); 
    
  }

  constructor(private router: Router, private store: Store) {}
}
