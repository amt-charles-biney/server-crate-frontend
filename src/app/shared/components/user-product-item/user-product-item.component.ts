import { Component, Input, OnInit } from '@angular/core';
import { ProductItemSubset } from '../../../types';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { CloudinaryUrlPipe } from '../../pipes/cloudinary-url/cloudinary-url.pipe';
import { BuyNowComponent } from './features/buy-now/buy-now.component';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { HoverDirective } from '../../directives/hover/hover.directive';
import { WishlistButtonComponent } from '../wishlist-button/wishlist-button.component';

@Component({
  selector: 'app-user-product-item',
  standalone: true,
  imports: [
    CurrencyPipe,
    BuyNowComponent,
    NgOptimizedImage,
    CommonModule,
    CloudinaryUrlPipe,
    HoverDirective,
    WishlistButtonComponent
  ],
  templateUrl: './user-product-item.component.html',
})
export class UserProductItemComponent implements OnInit {
  @Input() product!: ProductItemSubset;
  @Input() isGrid: boolean = true;
  isSelected: boolean = false;
  hovered!: boolean;
  colored = false;

  ngOnInit(): void {    
    let productsInStorage = JSON.parse(sessionStorage.getItem('products')!);
    if (productsInStorage[this.product.id]) {
      this.colored = true;
    }
  }

  buyNow(id: string) {
    const dialogRef = this.dialog.open(BuyNowComponent, {
      height: '80%',
      width: '70%',
      data: {
        id,
      },
    });
    if (screen.width > 1280) {
      dialogRef.updateSize('55%', "70%")
    }
  }

  onNavigateToProduct(event: Event, id: string) {
    event.stopPropagation();
    if (this.product.configurationUrl) {
      this.router.navigateByUrl(this.product.configurationUrl);
    } else {
      this.router.navigate(['/product/configure', id]);
    }
  }

  addToCompare(id: string) {
    let productsForComparison: Record<string, boolean> = { [id]: true };
    let productsInStorage = JSON.parse(sessionStorage.getItem('products')!);
    if (productsInStorage[id]) {
      delete productsInStorage[id];
      productsForComparison = { ...productsInStorage };
      this.colored = false;
    } else {
      if (Object.values(productsInStorage).length < 5) {
        productsForComparison = { ...productsInStorage, [id]: true };
        this.colored = true;
      } else {
        this.toast.info(
          'Reached the maximum number of products for comparison',
          'Info'
        );
      }
    }

    sessionStorage.setItem('products', JSON.stringify(productsForComparison));
  }

  constructor(
    private router: Router,
    private store: Store,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {}
}
