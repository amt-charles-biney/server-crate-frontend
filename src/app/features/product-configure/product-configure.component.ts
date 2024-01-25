import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
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
  ICategoryOption,
  ICompatibleOption,
  IConfiguredOption,
  IConfiguredProduct,
  IParamConfigOptions,
  IProductConfiguration,
  IProductConfigureOptionType,
  ProductItem,
} from '../../types';
import { Store } from '@ngrx/store';
import {
  selectProduct,
  selectProductConfig,
  selectProductConfigItem,
  selectProductConfigItemLoading,
} from '../../store/product-spec/product-spec.reducer';
import { Observable, map } from 'rxjs';
import {
  loadProduct,
  loadProductConfigItem,
} from '../../store/product-spec/product-spec.action';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import cloneDeep from 'lodash.clonedeep';

@Component({
  selector: 'app-product-configure',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    MatTabsModule,
    RouterModule,
  ],
  templateUrl: './product-configure.component.html',
  styleUrl: './product-configure.component.scss',
})
export class ProductConfigureComponent {

  @ViewChild('selectConfig') selectConfig!: ElementRef;
  @ViewChild('selectSize') selectSize!: ElementRef;


  product$: Observable<ProductItem | null> =  this.store.select(selectProduct);
  productConfig$: Observable<any> =  this.store.select(selectProductConfig);
  productConfigItem$: Observable<IConfiguredProduct | null> =  this.store.select(selectProductConfigItem);
  loading$: Observable<boolean> = this.store.select(selectProductConfigItemLoading)
  

  productId: string = '';
  productConfig!: ICategoryConfig;
  product!: ProductItem;
  warranty: boolean = false;
  loading: boolean = false
  size: string = '0'
  componentSizable: string = ""
  unit:string = "GB"

  productConfigItem: IConfiguredProduct = {
    totalPrice: 0,
    productName: "",
    configuredPrice: 0,
    configured: [],
    productId: '',
    productPrice: 0,
    id: null,
    warranty: false,
    vat: 0,
  };

  isMeasuredPriceMapper: {[key: string]: number} = {}

  activeLink: string = '';
  configKeys: string[] = [];
  queryMapper: { [key: string]: string } = {};
  isComponentSizableQueryMapper: ({[key: string]: string}) = {}

  setActiveLink = (active: string) => {
    this.unit = this.productConfig.options[active][0]?.unit || "GB"
    this.activeLink = active
  }

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')?.toString() || '';

    this.store.dispatch(loadProduct({ id: this.productId }));

    this.productConfigItem$.subscribe((product) => {
      if (product) this.productConfigItem = product;
      this.buildQueryMapper()
      this.cdr.detectChanges()
    });

    this.productConfig$.subscribe((product) => {
      if (product) this.productConfig = product;
    });

    this.loading$.subscribe(loader => {
       this.loading = loader;
    })

    this.route.queryParams.subscribe((queryParams) => {
      const configOptions: IParamConfigOptions = {
        warranty: queryParams['warranty'] || this.warranty,
        components: queryParams['components']
      };
      this.store.dispatch(loadProductConfigItem({ productId: this.productId, configOptions }));
    });

    this.getConfigKeys().subscribe((keys) => {
      this.configKeys = keys;
      this.setActiveLink(keys[0])
    });
  }

  getConfigKeys = (): Observable<string[]> => {
    return this.productConfig$.pipe(
      map((config: any) => Object.keys(config?.options || {}))
    );
  };

  getMeasuredUnit = ():string => { return " "}

  onOptionChange(check: boolean) {
    this.warranty = check;
    this.updateConfigQueryParam(null, this.warranty)
  }

  buildQueryMapper = () => {
    for (let product of this.productConfigItem.configured) {
      this.queryMapper[product.optionType] = `${product.optionId}_${product.isMeasured ? product?.size || product?.baseAmount : product?.baseAmount || 0}`;
      if(product?.isMeasured) this.isMeasuredPriceMapper[product.optionType] = product.optionPrice;
    }
  }

  calculateisMeasuredPrice = (type: string) => {
    return this.productConfigItem.configured.filter(config => config.optionType === type)[0]?.optionPrice || 0
  }
  

  onSizeableOptionChange = ({ type, id = this.componentSizable, size = this.size }: { type: string, id: string, size: string }) => {
    this.componentSizable = id;
    this.size = size;
    this.updateConfigQueryParam({ type, id: id, size: size });
  };
  


  updateConfigQueryParam = ( configItem: { type: string; id: string; size: string } | null, warranty = this.warranty): void => {
    if (configItem) this.queryMapper[configItem.type] = `${configItem.id}_${configItem.size}`;
    
    const joinQuery = Object.values(this.queryMapper).join(',');
    const currentParams = { ...this.route.snapshot.queryParams, warranty, components: joinQuery };
    
    const navigationExtras: NavigationExtras = { queryParams: currentParams, queryParamsHandling: 'merge' };
    
    this.router.navigate([], navigationExtras);
  };


isActiveSelectedOption = ({ type, id, size }: { type: string; id: string; size: string }): boolean => this.queryMapper[type] === `${id}_${size || 0}`;

generateStorageSizes(productArr: any[]): number[] {
    let storageSize = [];
    const minBaseAmount = productArr.reduce((min, option) => Math.min(min, option.baseAmount), Infinity);
    const maxMaxAmount = productArr.reduce((max, option) => Math.max(max, option.maxAmount), -Infinity);
    const stepMultiplier = 2;
  
    for (let size = minBaseAmount; size <= maxMaxAmount; size *= stepMultiplier) {
      storageSize.push(size);
    }
  
    return storageSize;
  }

  resetDefault(type: string) {
    const getIncludedProduct = this.productConfig.options[type].filter(product => product.isIncluded == true)[0]
    if(getIncludedProduct) this.updateConfigQueryParam({ type, id: getIncludedProduct?.id, size: getIncludedProduct?.baseAmount.toString()})
    else {
         delete this.queryMapper[type]
         this.updateConfigQueryParam(null)
    }
  }

  isActiveLinkMeasured = (activeLink: string) => {
    return this.productConfig.options[activeLink].some(item => item.isMeasured === true)
  }
  
}
