import { Component, Input } from '@angular/core'
import { type IParamConfigOptions, type IConfiguredProduct } from '../../../types'

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [],
  templateUrl: './order-summary.component.html'
})
export class OrderSummaryComponent {
  @Input() productConfigItem!: IConfiguredProduct
  @Input() warranty: any = false
  @Input() components!: (Record<string, string>)

  addProductToCart (): void {
    const queryComponents = Object.values(this.components).join(',')
    const configOptions: IParamConfigOptions = { warranty: this.warranty, components: queryComponents }

    console.log('config options ', configOptions)
  }
}
