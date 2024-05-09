import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy } from '@angular/core';
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
  IdefaultSelectedProps,
  REQUIRED_CONFIG,
  ICategoryOption,
} from '../../types';
import { Store } from '@ngrx/store';
import {
  selectCallState,
  selectProduct,
  selectProductConfig,
  selectProductConfigItem,
} from '../../store/product-spec/product-spec.reducer'
import { Observable, Subscription, tap } from 'rxjs'
import {
  addToCartItem,
  loadProduct,
  loadProductConfigItem,
  productConfigReset
} from '../../store/product-spec/product-spec.action'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { MatTabsModule } from '@angular/material/tabs'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { OrderSummaryComponent } from './order-summary/order-summary.component'
import { ProductLoadingComponent } from './product-loading/product-loading.component';
import { CloudinaryUrlPipe } from '../../shared/pipes/cloudinary-url/cloudinary-url.pipe';
import { ImageSliderComponent } from '../../mobile/image-slider/image-slider.component';
import { SpecificationsComponent } from '../../shared/components/specifications/specifications.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { getCallState } from '../../core/utils/helpers';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-configure',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    OrderSummaryComponent,
    ProductLoadingComponent,
    NgOptimizedImage,
    CloudinaryUrlPipe,
    ImageSliderComponent,
    SpecificationsComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-configure.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({
          transform: 'translateY(-120%)'
        }),
        animate('100ms ease-in', style({ transform: 'translateY(0)'}))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)'}),
        animate('100ms ease-in', style({ transform: 'translateY(-120%)'}))
      ])
    ])
  ]
})

export class ProductConfigureComponent implements OnDestroy {
  defaultSelectedValues: (Record<string, IdefaultSelectedProps>) = {}
  defaultIncludedPrices: (Record<string, IdefaultSelectedProps>) = {}
  defaultUIChangePrice: (Record<string, IdefaultSelectedProps>) = {}
  defaultUIConstantPrice: (Record<string, number | null>) = {};

  privateQueryParamSubscription: Subscription | undefined;
  privateConfigItemSubscription: Subscription | undefined;
  privateConfigSubscription: Subscription | undefined;

  imageUrls: string[] = []
  technicalSupportInfoIsClicked = false
  orderSummaryIsVisible = false
  isLoading!: boolean;
  error!: string | null;
  callState$ = this.store.select(selectCallState).pipe(
    tap((callState) => {
      [this.isLoading, this.error] = getCallState(callState)
    })
  );
  product$: Observable<ProductItem | null> = this.store.select(selectProduct).pipe(
    tap((product: ProductItem | null) => {
      if (product !== null) {
        this.imageUrls = [product.coverImage, ...product.imageUrl]        
      }
    })
  )
  productConfig$: Observable<any> = this.store.select(selectProductConfig)
  productConfigItem$: Observable<IConfiguredProduct | null> = this.store.select(selectProductConfigItem)

  RequiredConfig: Record<string, boolean> = {
    [REQUIRED_CONFIG.BRAND.toLowerCase()]: true,
    [REQUIRED_CONFIG.MOTHERBOARD.toLowerCase()]: true,
    [REQUIRED_CONFIG.OPERATING_SYSTEM.toLowerCase()]: true,
    [REQUIRED_CONFIG.CASE.toLowerCase()]: true,
    [REQUIRED_CONFIG.GRAPHICS_CARD.toLowerCase()]: true,
    [REQUIRED_CONFIG.RAM.toLowerCase()]: true,
    [REQUIRED_CONFIG.STORAGE.toLowerCase()]: true,
  }

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

  openTechnicalSupportInfo() {
    this.technicalSupportInfoIsClicked = true;
  }
  
  closeTechnicalSupportInfo() {
    this.technicalSupportInfoIsClicked = false;
  }

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    scrollTo({top: 0, behavior: 'smooth' })
    this.productId = this.route.snapshot.paramMap.get('id')?.toString() ?? ''

    this.store.dispatch(loadProduct({ id: this.productId }))

    this.privateConfigItemSubscription = this.productConfigItem$.subscribe((product: IConfiguredProduct | null) => {
      if (product !== null) this.productConfigItem = product
      this.buildQueryMapper()
      this.cdr.detectChanges()
    })

    this.privateConfigSubscription = this.productConfig$.subscribe((product: ICategoryConfig) => {
      if (product !== null) {
        this.productConfig = product
        const keys: string[] = Object.keys(product?.options)

        keys.forEach(key => {
          const IncludedProduct = product?.options[key]?.find(option => option.isIncluded)

          if (IncludedProduct) {
            this.defaultIncludedPrices[key] = {
              id: IncludedProduct.compatibleOptionId,
              price: IncludedProduct.price,
              size: String(IncludedProduct.size) ?? String(IncludedProduct.baseAmount) ?? "0",
              isIncluded: IncludedProduct.isIncluded,
            }
          }
          this.setDefaultSelectedValues(key, IncludedProduct || product?.options[key][0])
        })

        this.configKeys = keys
        this.setActiveLink(keys[0])
        this.mapToAttributeVariantsRecord(product.options)
      }
    })

    this.privateQueryParamSubscription = this.route.queryParams.subscribe((queryParams: { [x: string]: any; }) => {
      const configOptions: IParamConfigOptions = {
        warranty: queryParams['warranty'] ?? this.warranty,
        components: queryParams['components']
      }

      this.querySnapShot = configOptions
      this.store.dispatch(loadProductConfigItem({ productId: this.productId, configOptions }))
    })
  }
  ngOnDestroy(): void {
    this.privateQueryParamSubscription?.unsubscribe()
    this.privateConfigItemSubscription?.unsubscribe()
    this.privateConfigSubscription?.unsubscribe()
    this.store.dispatch(productConfigReset())
    this.imageUrls = []
  }
  onOptionChange(check: boolean): void {
    this.warranty = check
    this.updateConfigQueryParam(null, this.warranty)
  }


  buildQueryMapper = (): void => {
    for (const product of this.productConfigItem.configured) {
      this.queryMapper[product.optionType] = `${product.optionId}_${product.isMeasured ? product?.size || product?.baseAmount : 0}`
      if (product?.isMeasured) {
        this.defaultSelectedValues[product.optionType] = { id: product.optionId, size: product.size || String(product.baseAmount), price: product.optionPrice, isIncluded: product.included }
      }
    }
  }


  setDefaultSelectedValues(optionType: string, products: ICompatibleOption): void {
    if (!this.defaultSelectedValues[optionType] && products != null && products.isMeasured) {

      const { compatibleOptionId, isIncluded, price, baseAmount, size } = products;

      this.defaultSelectedValues[optionType] = {
        id: compatibleOptionId,
        size: String(size) || String(baseAmount),
        price,
        isIncluded: isIncluded
      };
    }
  }



  onSizeableOptionChange = ({ type, id, size }: IConfigureSelectProps): void => {
    this.defaultSelectedValues[type] = { ...this.defaultSelectedValues[type], size: String(size) }
    this.updateConfigQueryParam({ type, id: this.defaultSelectedValues[type]?.id, size })
  }


  onSelectVariantSizableChange = ({ type, id }: IConfigureSelectProps): void => {
    const getCurrentConfiguredProduct: any = this.productConfig.options[type]?.find(product => product.compatibleOptionId === id)
    const adjustedSize = getCurrentConfiguredProduct?.size

    this.defaultSelectedValues[type] = { ...this.defaultSelectedValues[type], id, size: String(adjustedSize) }
    this.updateConfigQueryParam({ type, id, size: adjustedSize })
  }



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

  isActiveSelectedOption = ({ type, id, size }: IConfigureSelectProps): boolean => {
    const isActive = this.queryMapper[type] === `${id}_${0}`
    if (isActive) this.defaultUIConstantPrice[this.activeLink] = this.defaultUIChangePrice[id].price ?? null
    return isActive;
  }


  generateStorageSizes(attributeId: string, productArr: any[]): string[] {
    const getProduct = productArr.find(product => product.compatibleOptionId === attributeId)
    const storageSize: string[] = []

    for (let size: number = getProduct?.baseAmount; size <= getProduct?.maxAmount; size *= 2) {
      storageSize.push(String(size))
    }
    return storageSize
  }

  addProductToCart (): void {
    document.body.scrollTo({ top: 0, behavior: 'smooth' })
    this.store.dispatch(addToCartItem({ productId: this.productId, configOptions: this.querySnapShot  }))
  }


  resetDefault(type: string): void {
    const getIncludedProduct: ICompatibleOption | null = this.productConfig.options[type].find(product => product.isIncluded) ?? null

    if (getIncludedProduct !== null) {
      this.setDefaultSelectedValues(type, getIncludedProduct);

      if (getIncludedProduct.isMeasured) {
        this.defaultSelectedValues[type].size = String(getIncludedProduct.size) || String(getIncludedProduct.baseAmount);
      }

      this.updateConfigQueryParam({
        type,
        id: getIncludedProduct.compatibleOptionId,
        size: (getIncludedProduct.isMeasured) ? getIncludedProduct.size || getIncludedProduct.baseAmount.toString() : '0'
      });

      if (this.isSizablePricing(type)) {
        this.defaultSelectedValues[type].size = String(getIncludedProduct.size);
      }
    } else {
      delete this.queryMapper[type];
      this.defaultUIConstantPrice[this.activeLink] = null;
      this.updateConfigQueryParam(null);
    }
  }


  isActiveLinkMeasured = (activeLink: string): boolean => { return this.productConfig.options[activeLink].some(item => item.isMeasured) }

  gotoProduct = (): void => { void this.router.navigate(['/servers'], { replaceUrl: true }) }


  getPriceDifference(selectedOption: IdefaultSelectedProps): string {
    const { id } = selectedOption

    const defaultPrice = this.defaultUIConstantPrice[this.activeLink] ?? 0
    let priceDifference = this.defaultUIConstantPrice[this.activeLink] ? this.defaultUIChangePrice[id].price - defaultPrice: this.defaultUIChangePrice[id].price

    let sign = priceDifference > 0 ? "+" : priceDifference < 0 ? "-" : "";
    
    return this.isActiveSelectedOption({
      type: this.activeLink,
      id: id,
      size: ""
    }) ? "Included" : `${sign} $${Math.abs(priceDifference).toFixed(2)}`;
  }


  getPriceDiffereceMeasured(selectedOption: IdefaultSelectedProps): string {
    const { id, price } = selectedOption

    let priceDifference = this.defaultIncludedPrices[id] ? price - this.defaultIncludedPrices[id].price : price;
    
    let sign = priceDifference > 0 ? "+" : priceDifference < 0 ? "-" : "";
    return `${sign} $${Math.abs(priceDifference).toFixed(2)}`
  }


  isSizablePricing(activeLink: string): boolean {
    if (!this.defaultIncludedPrices[activeLink]) return false;

    return this.defaultSelectedValues[activeLink].id === this.defaultIncludedPrices[activeLink].id &&
      this.defaultSelectedValues[activeLink].size === this.defaultIncludedPrices[activeLink].size &&
      this.defaultSelectedValues[activeLink].isIncluded;
  }


  isRequiredConfig(optionType: string): boolean {
    return this.RequiredConfig[optionType.toLowerCase()];
  }

  mapToAttributeVariantsRecord(categoryOptions: ICategoryOption) {
    Object.keys(categoryOptions).forEach(categoryKey => {
      const compatibleOptions: ICompatibleOption[] = categoryOptions[categoryKey];

      Object.values(compatibleOptions).forEach((compatibleOptionArray: ICompatibleOption) => {
        const { compatibleOptionId, attributeId, price } = compatibleOptionArray
        this.defaultUIChangePrice[compatibleOptionId] = {
          isIncluded: false,
          price,
          id: attributeId,
          size: ""
        }
      });
    });
  }

  @HostListener('document:scroll', ['$event']) onScrollWindow(event: Event) {
    if (window.scrollY > 375) {
      this.orderSummaryIsVisible = true
    } else {
      this.orderSummaryIsVisible = false
    }
  }
}
