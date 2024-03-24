import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CloudinaryUrlPipe } from '../../../../pipes/cloudinary-url/cloudinary-url.pipe';
import { Store } from '@ngrx/store';
import { loadProduct, loadProductConfigItem } from '../../../../../store/product-spec/product-spec.action';
import { selectProduct, selectProductConfig, selectProductConfigItem } from '../../../../../store/product-spec/product-spec.reducer';
import { Observable, tap } from 'rxjs';
import { IConfiguredProduct, IParamConfigOptions } from '../../../../../types';

@Component({
  selector: 'app-buy-now',
  standalone: true,
  imports: [NgOptimizedImage, CloudinaryUrlPipe, CommonModule],
  templateUrl: './buy-now.component.html',
})
export class BuyNowComponent implements OnInit {
  product!: Observable<any>
  productConfig!: Observable<IConfiguredProduct | null>;
  constructor(
    public dialogRef: MatDialogRef<BuyNowComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string
    },
  ) {
    console.log("Id", this.data.id);
  }
  
  ngOnInit(): void {
    console.log("Id", this.data.id);
    const configOptions: IParamConfigOptions = {
      warranty: true,
      components:''
    }
    this.store.dispatch(loadProduct({ id: this.data.id }))
    this.store.dispatch(loadProductConfigItem({ productId: this.data.id, configOptions }))
    this.product = this .store.select(selectProduct).pipe(
      tap((pdt) => {
        console.log('Product', pdt)
      })
    )
    this.productConfig = this.store.select(selectProductConfigItem).pipe(
      tap((config) => {
        console.log("config", config);
      })
    )
  }
}
