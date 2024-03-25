import { Component, Input } from '@angular/core';
import { ProductItemSubset } from '../../../types';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { CloudinaryUrlPipe } from '../../pipes/cloudinary-url/cloudinary-url.pipe';
import { BuyNowComponent } from './features/buy-now/buy-now.component';
import { Store } from '@ngrx/store';
import {
  addToWishlist,
  removeFromWishlist,
} from '../../../store/admin/products/categories.actions';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { HoverDirective } from '../../directives/hover/hover.directive';

@Component({
  selector: 'app-user-product-item',
  standalone: true,
  imports: [
    CurrencyPipe,
    BuyNowComponent,
    NgOptimizedImage,
    CommonModule,
    CloudinaryUrlPipe,
    HoverDirective
  ],
  templateUrl: './user-product-item.component.html',
})
export class UserProductItemComponent {
  @Input() product!: ProductItemSubset;
  @Input() isGrid: boolean = true;
  isSelected: boolean = false;
  hovered!: boolean

  buyNow(id: string) {
    this.dialog.open(BuyNowComponent, {
      height: '80%',
      width: '70%',
      data: {
        id
      }
    });
  }

  onNavigateToProduct(event: Event, id: string) {
    event.stopPropagation();
    this.router.navigate(['/product/configure', id]);
  }

  addToWishlist(id: string) {
    this.store.dispatch(addToWishlist({ id }));
  }

  removeFromWishlist(id: string) {
    this.store.dispatch(removeFromWishlist({ id }));
  }

  addToCompare(id: string) {
    let productsForComparison: Record<string, string> = {[id]: id};
    if (localStorage.getItem('products')) {
      const productsInStorage = JSON.parse(localStorage.getItem('products')!);
      if (Object.values(productsInStorage).length < 5) {
        productsForComparison = { ...productsInStorage, [id]: id };
      } else {
        this.toast.info(
          'Reached the maximum number of products for comparison',
          'Info'
        );
        return;
      }
    }

    localStorage.setItem('products', JSON.stringify(Object.values(productsForComparison)));
  }

  constructor(
    private router: Router,
    private store: Store,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {}
}
