import { Store } from '@ngrx/store';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CustomCheckBoxComponent } from '../../shared/components/custom-check-box/custom-check-box.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductItem } from '../../types';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { getProducts, getUserProducts } from '../../store/admin/products/categories.actions';
import { selectProducts, selectTotal } from '../../store/admin/products/products.reducers';
import { UserProductItemComponent } from '../../shared/components/user-product-item/user-product-item.component';
import { filter } from '../../store/users/users.actions';

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
    UserProductItemComponent
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

  private products$ = new BehaviorSubject<ProductItem[]>([]);
  products: Observable<ProductItem[]> = this.products$.asObservable();
  total!: Observable<number>
  page: number = 0;

  constructor(private store: Store) {}
  ngOnInit(): void {
    this.onLoad();
    this.getPage(1);
  }
  getPage(pageNumber: number) {
    this.page = pageNumber;
    const params = this.buildParams(this.queryParams)
    this.store.dispatch(getUserProducts({ page: this.page - 1, params }));
    this.products = this.store.select(selectProducts);
    this.total = this.store.select(selectTotal);
  }
  onLoad() {
    this.queryParams = {
      producttype: new Set(),
      processor: new Set(),
      price: new Set(),
      brand: new Set(),
      mounting: new Set(),
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
    const params = this.buildParams(this.queryParams)
    this.store.dispatch(filter({params, page: this.page - 1}))
    console.log(this.buildParams(this.queryParams));
  }

  buildParams(params: Record<string, Set<string>>) {
    const keys = ['producttype', 'processor', 'price', 'brand', 'mounting'];
    let paramArray = [];
    for (let key of keys) {
      const keyValues = Array.from(params[key]);
      if (keyValues.length !== 0) {
        paramArray.push(`${key}=${keyValues.join(', ')}`);
      }
    }
    return paramArray.join('&');
  }

  clearFilters() {
    this.onLoad()
    const params = this.buildParams(this.queryParams)
    this.store.dispatch(filter({params, page: this.page}))
  }

  get productType() {
    return this.filterForm.get('productType')!;
  }
}
