import { Component } from '@angular/core';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductItem } from '../../types';
import { Store } from '@ngrx/store';
import {
  selectLoading,
  selectProduct,
  selectProductConfig,
} from '../../store/product-spec/product-spec.reducer';
import { Observable, map } from 'rxjs';
import {
  loadProduct,
  loadProductConfig,
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
  productId: string = '';
  product$!: Observable<ProductItem | null>;
  productLoading!: Observable<boolean>;
  productConfig!: Observable<any>;
  configKeys: string[] = [];

  productConfigInstance: any = {};
  product: ProductItem | any;

  activeLink: string = '';

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')?.toString() || '';
    this.product$ = this.store.select(selectProduct);
    this.productLoading = this.store.select(selectLoading);
    this.productConfig = this.store.select(selectProductConfig);

    this.store.dispatch(loadProduct({ id: this.productId }));

    this.getConfigKeys().subscribe((keys) => {
      this.configKeys = keys;
      this.activeLink = keys[0];
    });

    this.product$.subscribe((prod) => {
      this.product = cloneDeep(prod);
    });

    this.productConfig.subscribe((product) => {
      this.productConfigInstance = cloneDeep(product);
    });
  }

  gotoProducts = (): void => {
    this.router.navigate(['/product'], { replaceUrl: true });
  };

  gotoHome = (): void => {
    this.router.navigate(['/'], { replaceUrl: true });
  };

  getConfigKeys = (): Observable<string[]> => {
    return this.productConfig.pipe(
      map((config: any) => Object.keys(config?.options || {}))
    );
  };

  setActiveLink = (active: string) => {
    this.activeLink = active;
  };

  filterProductOptionIncluded = (key: string): string => {
    const options = this.productConfigInstance?.options[key];
    return options.reduce((accum: string, option: any) => {
      return option.isIncluded ? accum + option.name : accum;
    }, '');
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
}
