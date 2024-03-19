import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductItem, ProductItemSubset } from '../../../types';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { CloudinaryUrlPipe } from '../../pipes/cloudinary-url/cloudinary-url.pipe';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BuyNowComponent } from './features/buy-now/buy-now.component';

@Component({
  selector: 'app-user-product-item',
  standalone: true,
  imports: [
    CurrencyPipe,
    // BuyNowComponent,
    NgOptimizedImage,
    MatDialogModule,
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

  constructor(private router: Router, private dialog: MatDialog) {}
}
