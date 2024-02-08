import { Component, Input } from '@angular/core'
import { type IParamConfigOptions, type IConfiguredProduct } from '../../../types'
import { Store } from '@ngrx/store'
import { addToCartItem } from '../../../store/product-spec/product-spec.action'
import { Router } from 'express'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [],
  templateUrl: './order-summary.component.html'
})
export class OrderSummaryComponent {
  @Input() productConfigItem!: IConfiguredProduct
  @Input() warranty: any = false
  @Input() productId!: string
  @Input() querySnapShot!: IParamConfigOptions

  constructor (private store: Store, private router: ActivatedRoute) {}

  addProductToCart (): void {
    console.log('config options ', this.querySnapShot)
    this.store.dispatch(addToCartItem({ productId: this.productId, configOptions: this.querySnapShot  }))
  }
}
