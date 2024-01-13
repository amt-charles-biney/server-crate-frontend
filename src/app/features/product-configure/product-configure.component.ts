import { Component } from '@angular/core';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ICategoryConfig,
  ICompatibleOption,
  IProductConfiguration,
  IProductConfigureOptionType,
  ProductItem,
} from '../../types';
import { Store } from '@ngrx/store';
import {
  selectProduct,
  selectProductConfig,
} from '../../store/product-spec/product-spec.reducer';
import { Observable, map } from 'rxjs';
import {
  loadProduct,
} from '../../store/product-spec/product-spec.action';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import cloneDeep from 'lodash.clonedeep';

@Component({
  selector: 'app-product-configure',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, MatTabsModule],
  templateUrl: './product-configure.component.html',
  styleUrl: './product-configure.component.scss',
})
export class ProductConfigureComponent {
  product$!: Observable<ProductItem | null>;
  productConfig!: Observable<any>;

  productConfigInstance!: ICategoryConfig | any;
  product!: ProductItem;
  productConfigItem!: IProductConfiguration;

  productId: string = '';
  warranty: boolean = false;
  activeLink: string = '';

  configKeys: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')?.toString() || '';
    this.product$ = this.store.select(selectProduct);
    this.productConfig = this.store.select(selectProductConfig);

    this.store.dispatch(loadProduct({ id: this.productId }));

    this.getConfigKeys().subscribe((keys) => {
      this.configKeys = keys;
      this.activeLink = keys[0];
    });

    this.product$.subscribe((prod) => {
      if (prod) {
        this.product = cloneDeep(prod);
        this.productConfigItem = this.transformToProductConfiguration(prod);
      }
    });

    this.productConfig.subscribe((product) => {
      if (product) {
        this.productConfigInstance = cloneDeep(product);
        this.productConfigItem = {
          ...this.productConfigItem,
          configurations: this.transformToDefaultCategoryConfigOptions(product),
        };
        this.updateProductPrice(this.productConfigItem);
      }
    });
  }

  transformToProductConfiguration(product: ProductItem): IProductConfiguration {
    const configuration: IProductConfiguration = {
      productId: product.productId,
      configurations: [],
      productPrice: parseFloat(product.productPrice),
      configurationPrice: 0,
      totalPrice: parseFloat(product.productPrice),
      warrantyType: this.warranty,
      vatIncluded: 0,
    };

    return configuration;
  }

  transformToDefaultCategoryConfigOptions(
    productConfig: ICategoryConfig
  ): IProductConfigureOptionType[] {
    const defaultConfigOptions: IProductConfigureOptionType[] = [];

    for (const key in productConfig.options) {
      if (productConfig.options.hasOwnProperty(key)) {
        const optionsArray: ICompatibleOption[] = productConfig.options[key];

        optionsArray.forEach((option) => {
          if (option.isIncluded) {
            const configOption: IProductConfigureOptionType = {
              name: option.name,
              attribute: option.type,
              price: option.price,
            };
            defaultConfigOptions.push(configOption);
          }
        });
      }
    }

    return defaultConfigOptions;
  }

  updateProductPrice = (product: IProductConfiguration): void => {
    const configurationPrice = product?.configurations.reduce(
      (accum, val: IProductConfigureOptionType) =>
        (accum += Number(val?.price)),
      0
    );
    const totalPrice = Number(product?.productPrice || 0) + configurationPrice;

    this.productConfigItem = {
      ...this.productConfigItem,
      totalPrice,
      configurationPrice,
    };
  };

  gotoProducts = () => {
    this.router.navigate(['/product'], { replaceUrl: true });
  };
  gotoHome = (): void => {
    this.router.navigate(['/'], { replaceUrl: true });
  };

  setActiveLink = (active: string) => {
    this.activeLink = active;
  };

  getConfigKeys = (): Observable<string[]> => {
    return this.productConfig.pipe(
      map((config: any) => Object.keys(config?.options || {}))
    );
  };

  swapImage = (imgtoSwap: string, imageIdx: number) => {
    let updatedProduct: any = { ...this.product };
    let previousCoverImage = updatedProduct.coverImage;
    updatedProduct.coverImage = imgtoSwap;
    if (updatedProduct.imageUrl && updatedProduct.imageUrl[imageIdx]) {
      updatedProduct.imageUrl[imageIdx] = previousCoverImage;
    }

    this.product = { ...updatedProduct };
  };

  onOptionChange(check: boolean) {
    this.warranty = check;
  }
}
