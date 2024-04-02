import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CloudinaryUrlPipe } from '../../../../pipes/cloudinary-url/cloudinary-url.pipe';
import { Store } from '@ngrx/store';
import {
  addToCartItem,
  loadProduct,
  loadProductConfigItem,
} from '../../../../../store/product-spec/product-spec.action';
import {
  selectProduct,
  selectProductConfig,
  selectProductConfigItem,
} from '../../../../../store/product-spec/product-spec.reducer';
import { Observable, tap } from 'rxjs';
import { IConfiguredProduct, IParamConfigOptions } from '../../../../../types';

@Component({
  selector: 'app-buy-now',
  standalone: true,
  imports: [NgOptimizedImage, CloudinaryUrlPipe, CommonModule],
  templateUrl: './buy-now.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuyNowComponent implements OnInit {
  product!: Observable<any>;
  productConfig!: Observable<IConfiguredProduct | null>;
  allowedOptionTypes: string[] = [
    'Graphics',
    'Motherboard',
    'RAM',
    'Storage',
    'Operating Systems',
    'Processors'
  ];
  warranty: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<BuyNowComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
    }
  ) {}

  ngOnInit(): void {
    const configOptions: IParamConfigOptions = {
      warranty: false,
      components: '',
    };
    this.store.dispatch(loadProduct({ id: this.data.id }));
    this.store.dispatch(
      loadProductConfigItem({ productId: this.data.id, configOptions })
    );
    this.product = this.store.select(selectProduct);
    this.productConfig = this.store.select(selectProductConfigItem);
  }

  closeModal() {
    this.dialogRef.close()
  }

  onOptionChange(warranty: boolean) {
    this.warranty = warranty;
  }

  addToCart(id: string) {    
    this.store.dispatch(addToCartItem({ productId: id, configOptions: { warranty: this.warranty, components: ''}  }))
  }
}
