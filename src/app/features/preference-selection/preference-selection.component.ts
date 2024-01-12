import { search } from './../../store/users/users.actions';
import { Store } from '@ngrx/store';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CustomCheckBoxComponent } from '../../shared/components/custom-check-box/custom-check-box.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ProductItem, Select } from '../../types';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { getUserBrands, getUserProducts } from '../../store/admin/products/categories.actions';
import {
  selectProducts,
  selectTotal,
} from '../../store/admin/products/products.reducers';
import { UserProductItemComponent } from '../../shared/components/user-product-item/user-product-item.component';
import { filter } from '../../store/users/users.actions';
import { MatDialog } from '@angular/material/dialog';
import { CompareDialogComponent } from '../../shared/components/compare-dialog/compare-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { selectBrands } from '../../store/admin/products/categories.reducers';

@Component({
  selector: 'app-preference-selection',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    CustomCheckBoxComponent,
    ReactiveFormsModule,
    CustomButtonComponent,
    NgxPaginationModule,
    UserProductItemComponent,
  ],
  templateUrl: './preference-selection.component.html',
})
export class PreferenceSelectionComponent implements OnInit {
  @Input() id!: string;
  @Input() maxSize!: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageBoundsCorrection: EventEmitter<number> =
    new EventEmitter<number>();
  filterForm!: FormGroup;
  queryParams!: Record<string, Set<string>>;
  selectedProducts: ProductItem[] = [];

  private products$ = new BehaviorSubject<ProductItem[]>([]);
  products: Observable<ProductItem[]> = this.products$.asObservable();
  total!: Observable<number>;
  page: number = 0;
  brands$!: Observable<Select[]>;
  search: string = ''
  constructor(
    private store: Store,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.search = this.activatedRoute.snapshot.paramMap.get('search')!;
    this.store.dispatch(getUserBrands());
    this.onLoad();
    this.queryParams['query'].add(this.search)
    this.getPage(1, this.search);
    this.brands$ = this.store.select(selectBrands)
  }
  getPage(pageNumber: number, search: string) {
    this.page = pageNumber;
    const params = this.buildParams(this.queryParams);
    if (!search) {
      this.store.dispatch(getUserProducts({ page: this.page - 1, params }));
    } else {
      this.store.dispatch(filter({ page: 0, params: search }))
    }
    this.products = this.store.select(selectProducts);
    this.total = this.store.select(selectTotal);
  }
  onLoad() {
    this.queryParams = {
      productType: new Set(),
      processor: new Set(),
      price: new Set(),
      brand: new Set(),
      mounting: new Set(),
      query: new Set()
    };
    this.filterForm = new FormGroup({
      productType: new FormControl(''),
      processor: new FormControl(''),
      price: new FormControl(''),
      brand: new FormControl(''),
      mounting: new FormControl(''),
    });
  }
  itemSelected(selected: { name: string; value: string; isAdded: boolean }) {
    if (selected.isAdded) {
      this.queryParams[selected.name].add(selected.value);
    } else {
      this.queryParams[selected.name].delete(selected.value);
    }
    const params = this.buildParams(this.queryParams);
    this.store.dispatch(filter({ params, page: this.page - 1 }));
    console.log(this.buildParams(this.queryParams));
  }

  compareEvent() {
    console.log('Open');
    if (this.selectedProducts.length < 2) {
      this.dialog.open(CompareDialogComponent);
    }
  }

  onSelect(product: ProductItem) {
    this.selectedProducts = this.selectedProducts.filter((pdt) => product.id !== pdt.id)
    this.selectedProducts.push(product);
    if (this.selectedProducts.length === 2) {
      this.router.navigateByUrl('/compare', {
        state: {
          firstProduct: this.selectedProducts[0],
          secondProduct: this.selectedProducts[1],
        },
      });
    }
  }

  buildParams(params: Record<string, Set<string>>) {
    const keys = ['productType', 'processor', 'price', 'brand', 'mounting', 'query'];
    let paramArray = [];
    for (let key of keys) {
      const keyValues = Array.from(params[key]);
      if (keyValues.length !== 0) {
        paramArray.push(`${key}=${keyValues.join(',')}`);
      }
    }
    return paramArray.join('&');
  }

  clearFilters() {
    this.onLoad();
    this.router.navigateByUrl('/servers')
    const params = this.buildParams(this.queryParams);
    this.store.dispatch(filter({ params, page: this.page }));
  }

  get productType() {
    return this.filterForm.get('productType')!;
  }
}
