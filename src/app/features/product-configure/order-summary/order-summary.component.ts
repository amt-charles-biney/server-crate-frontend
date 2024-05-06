import { Component, Input } from '@angular/core'
import { type IParamConfigOptions, type IConfiguredProduct } from '../../../types'
import { Store } from '@ngrx/store'
import { addToCartItem } from '../../../store/product-spec/product-spec.action'
import { Observable } from 'rxjs'
import { selectProductCartItemLoading } from '../../../store/product-spec/product-spec.reducer'
import { CommonModule } from '@angular/common'
import { addToWishlist } from '../../../store/admin/products/categories/categories.actions'

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-summary.component.html'
})
export class OrderSummaryComponent {
  @Input() productConfigItem!: IConfiguredProduct
  @Input() productId!: string
  @Input() querySnapShot!: IParamConfigOptions

  loader$: Observable<boolean> = this.store.select(selectProductCartItemLoading);

  constructor (private store: Store) {}

  addProductToCart (): void {
    document.body.scrollTo({ top: 0, behavior: 'smooth' })
    this.store.dispatch(addToCartItem({ productId: this.productId, configOptions: this.querySnapShot  }))
  }

  addToWishlist(id: string) {
    this.store.dispatch(addToWishlist({ id, configOptions: this.querySnapShot }));
  }
}
