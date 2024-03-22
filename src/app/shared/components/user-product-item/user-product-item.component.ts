import { Component, Input } from '@angular/core';
import { ProductItemSubset } from '../../../types';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { CloudinaryUrlPipe } from '../../pipes/cloudinary-url/cloudinary-url.pipe';
import { BuyNowComponent } from './features/buy-now/buy-now.component';
import { Store } from '@ngrx/store';
import { addToWishlist, removeFromWishlist } from '../../../store/admin/products/categories.actions';
import { ToastrService } from 'ngx-toastr';

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

  removeFromWishlist(id: string) {
    this.store.dispatch(removeFromWishlist({ id }))
  }

  addToCompare(product: ProductItemSubset) {
    let productsForComparison: ProductItemSubset[] = [product];
    if (localStorage.getItem('products')) {
      const productsInStorage = JSON.parse(localStorage.getItem('products')!);
      
      if (productsInStorage.length < 5) {
        productsForComparison = [...productsInStorage, product];
      } else {
        this.toast.info("Reached the maximum number of products for comparison", "Info")
        return
      }
    }

    localStorage.setItem('products', JSON.stringify(productsForComparison));
  }

  constructor(private router: Router, private store: Store, private toast: ToastrService) {}
}
