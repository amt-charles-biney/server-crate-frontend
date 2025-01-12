import { ChangeDetectorRef, Component } from '@angular/core';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import {
  ActivatedRoute,
  NavigationExtras,
  Router,
  RouterModule,
} from '@angular/router';
import {
  ICategoryConfig,
  ICompatibleOption,
  IConfigureSelectProps,
  IConfiguredProduct,
  IParamConfigOptions,
  ProductItem,
  IdefaultSelectedProps
} from '../../types';
import { Store } from '@ngrx/store';
import {
  selectProduct,
  selectProductConfig,
  selectProductConfigItem,
} from '../../store/product-spec/product-spec.reducer'
import { Observable, map } from 'rxjs'
import {
  loadProduct,
  loadProductConfigItem
} from '../../store/product-spec/product-spec.action'
import { CommonModule } from '@angular/common'
import { MatTabsModule } from '@angular/material/tabs'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { OrderSummaryComponent } from './order-summary/order-summary.component'
import { ProductLoadingComponent } from './product-loading/product-loading.component';

@Component({
  selector: 'app-product-configure',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    MatTabsModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    OrderSummaryComponent,
    ProductLoadingComponent
  ],
  templateUrl: './product-configure.component.html',
  styleUrl: './product-configure.component.scss'
})

export class ProductConfigureComponent {
  defaultSelectedValues: (Record<string, IdefaultSelectedProps>) = {}

  product$: Observable<ProductItem | null> = this.store.select(selectProduct)
  productConfig$: Observable<any> = this.store.select(selectProductConfig)
  productConfigItem$: Observable<IConfiguredProduct | null> = this.store.select(selectProductConfigItem)
  

  productId: string = ''
  productConfig!: ICategoryConfig
  product!: ProductItem
  warranty: boolean = false
  size: string = '0'
  unit: string = 'GB'

  productConfigItem: IConfiguredProduct = {
    totalPrice: 0,
    productName: '',
    configuredPrice: 0,
    configured: [],
    productId: '',
    productPrice: 0,
    id: null,
    warranty: false,
    vat: 0
  }

  activeLink: string = ''
  configKeys: string[] = []
  queryMapper: Record<string, string> = {}
  querySnapShot!: IParamConfigOptions

  setActiveLink = (active: string): void => {
    this.unit = this.productConfig.options[active][0]?.unit ?? 'GB'
    this.activeLink = active
  }

  constructor (
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit (): void {
    this.productId = this.route.snapshot.paramMap.get('id')?.toString() ?? ''

    this.store.dispatch(loadProduct({ id: this.productId }))

    this.productConfigItem$.subscribe((product) => {
      if (product !== null) this.productConfigItem = product
      this.buildQueryMapper()
      this.cdr.detectChanges()
    })

    this.productConfig$.subscribe((product: ICategoryConfig) => {
      if (product !== null) {
        this.productConfig = product
        const keys: string[] = Object.keys(product?.options)
        this.configKeys = keys
        this.setActiveLink(keys[0])
      }
    })

    this.route.queryParams.subscribe((queryParams) => {
      const configOptions: IParamConfigOptions = {
        warranty: queryParams['warranty'] ?? this.warranty,
        components: queryParams['components']
      }

      this.querySnapShot = configOptions
      this.store.dispatch(loadProductConfigItem({ productId: this.productId, configOptions }))
    })
  }

  /**
   * Updates the warranty check to involve warranty or not
   * @param check
   */
  onOptionChange(check: boolean): void {
    this.warranty = check
    this.updateConfigQueryParam(null, this.warranty)
  }

  /**
 * Builds the query mapper based on the configured products.
 * Assigns query strings to each product's optionType in the queryMapper object.
 * Also assigns default selected values for measured products in the defaultSelectedValues object.
 */
  buildQueryMapper = (): void => {
    for (const product of this.productConfigItem.configured) {
      this.queryMapper[product.optionType] = `${product.optionId}_${product.isMeasured ? product?.size || product?.baseAmount : 0}`
      if (product?.isMeasured) {
        this.defaultSelectedValues[product.optionType] = { id: product.optionId, size: product.size || String(product.baseAmount), price: product.optionPrice }
      }
    }
  }

  /**
   * Handles the change event for sizeable options.
   * Updates the defaultSelectedValues object with the new size.
   * Calls updateConfigQueryParam method to update configuration query parameters.
   * @param {IConfigureSelectProps} - An object containing type, id, and size properties.
   */
  onSizeableOptionChange = ({ type, id, size }: IConfigureSelectProps): void => {
    this.defaultSelectedValues[type] = { ...this.defaultSelectedValues[type], size: String(size) }
    this.updateConfigQueryParam({ type, id: this.defaultSelectedValues[type]?.id, size })
  }

  /**
 * Handles the change event for variant sizable options.
 * Retrieves the adjusted size for the selected option.
 * Updates the defaultSelectedValues object with the new id and adjusted size.
 * Calls updateConfigQueryParam method to update configuration query parameters.
 * @param {IConfigureSelectProps} - An object containing type and id properties.
 */
  onSelectVariantSizableChange = ({ type, id }: IConfigureSelectProps): void => {
    const getCurrentConfiguredProduct: any = this.productConfig.options[type]?.find(product => product.compatibleOptionId === id)
    const adjustedSize = getCurrentConfiguredProduct?.size

    this.defaultSelectedValues[type] = { ...this.defaultSelectedValues[type], id, size: String(adjustedSize) }
    this.updateConfigQueryParam({ type, id, size: adjustedSize })
  }

  /**
   * This Updated the query param with new config fetch updates
   *
   * @param configItem
   * @param warranty
   */

  updateConfigQueryParam = (configItem: IConfigureSelectProps | null, warranty = this.warranty): void => {
    if (configItem != null) {
      this.queryMapper[configItem.type] = `${configItem.id}_${configItem.size}`
    }

    const joinQuery = Object.values(this.queryMapper).join(',')

    const currentParams = {
      ...this.route.snapshot.queryParams,
      warranty,
      components: joinQuery
    }
    const navigationExtras: NavigationExtras = { queryParams: currentParams, queryParamsHandling: 'merge' }
    void this.router.navigate([], navigationExtras)
  }

  isActiveSelectedOption = ({ type, id, size }: IConfigureSelectProps): boolean => this.queryMapper[type] === `${id}_${0}`

  /**
   * Takes in the attribute id and generates the sizes ranging from the base amount to the max amount
   *
   * @param attributeId
   * @param productArr
   * @returns
   */
  generateStorageSizes (attributeId: string, productArr: any[]): string[] {
    const getProduct = productArr.find(product => product.compatibleOptionId === attributeId)
    const storageSize: string[] = []

    for (let size: number = getProduct?.baseAmount ?? 8; size <= getProduct?.maxAmount ?? 2056; size *= 2) {
      storageSize.push(String(size))
    }

    return storageSize
  }

  /**
 * Resets the default configuration for a specified type.
 * If an included product is available for the type, updates the configuration query parameters.
 * If no included product is found, removes the type from the query mapper and updates the configuration query parameters accordingly.
 *
 * @param type - The type of the product configuration to be reset.
 */

  resetDefault (type: string): void {
    const getIncludedProduct: ICompatibleOption | null = this.productConfig.options[type].find(product => product.isIncluded) ?? null

    if (getIncludedProduct !== null) {
      this.updateConfigQueryParam({
        type,
        id: getIncludedProduct.compatibleOptionId,
        size: (getIncludedProduct.isMeasured) ? getIncludedProduct?.baseAmount.toString() : '0'
      })
    } else {
      delete this.queryMapper[type]
      this.updateConfigQueryParam(null)
    }
  }

/**
   * Checks if the config options having the same attribute type has a measured field
   * @param activeLink
   * @returns
   */

  isActiveLinkMeasured = (activeLink: string): boolean => { return this.productConfig.options[activeLink].some(item => item.isMeasured) }

  gotoProduct = (): void => { void this.router.navigate(['/servers'], { replaceUrl: true }) }
}
