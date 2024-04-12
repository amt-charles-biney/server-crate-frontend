import { Store } from '@ngrx/store';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CustomCheckBoxComponent } from '../../shared/components/custom-check-box/custom-check-box.component';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { BehaviorSubject, Observable, startWith, tap } from 'rxjs';
import { ProductItem, Select } from '../../types';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import {
  getUserBrands,
  getUserProducts,
} from '../../store/admin/products/categories.actions';
import {
  selectContent,
  selectTotalElements,
} from '../../store/admin/products/products.reducers';
import { UserProductItemComponent } from '../../shared/components/user-product-item/user-product-item.component';
import { filter } from '../../store/users/users.actions';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { selectBrands, selectCategories, selectCases } from '../../store/admin/products/categories.reducers';
import { AttributeInputService } from '../../core/services/product/attribute-input.service';

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
  categories$!: Observable<Select[]>
  cases$!: Observable<Select[]>
  search: string = '';
  isGridMode: boolean = true;
  initialParams: Record<string, string> = { 'page': '0', 'size': '9' }

  localBrands: Select[] = []
  constructor(
    private store: Store,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private inputService: AttributeInputService
  ) {}
  ngOnInit(): void {
    this.onLoad();
    this.products = this.store.select(selectContent);
    this.total = this.store.select(selectTotalElements);

    this.activatedRoute.queryParams
      .subscribe((params) => {        
        console.log('Params', params);
        console.log('Brands', this.brands);
        
        this.store.dispatch(getUserProducts({ page: 0, params: {...this.initialParams, ...params } }));
      });
    if (this.search) {
      this.store.dispatch(filter({ page: 0, params: {...this.initialParams, query: this.search } }))
    }
    this.brands$ = this.store.select(selectBrands).pipe(
      tap((brands) => {
        this.localBrands = brands
        brands.forEach((brand) => this.brands.push(new FormControl({ name: brand.name, checked: false})))
        // this.localBrands = this.inputService.createDynamicGroup(brands)
        // this.filterForm.patchValue({ brand: this.localBrands})
      })
    )
    this.categories$ = this.store.select(selectCategories)
    this.cases$ = this.store.select(selectCases)
  }
  getPage(pageNumber: number, search: string) {
    this.page = pageNumber;
    const params = this.buildParams(this.queryParams);
    if (!search) {
      this.router.navigate(['/servers'], {
        queryParams: { ...params, 'page': (this.page - 1).toString() },
        replaceUrl: true,
      });
    } else {
      this.store.dispatch(filter({ page: 0, params: {...this.initialParams, query: search } }))
    }
    this.products = this.store.select(selectContent);
    this.total = this.store.select(selectTotalElements);
  }
  onLoad() {
    this.queryParams = {
      price: new Set(),
      brand: new Set(),
      categories: new Set(),
      productCase: new Set(),
      query: new Set(),
    };
    // this.filterForm = new FormGroup({
    //   price: new FormControl(''),
    //   brand: new FormControl(''),
    //   categories: new FormControl(''),
    //   productCase: new FormControl(''),
    // });

    this.filterForm = this.fb.group({
      price: this.fb.group({
        price1: '',
        price2: '',
        price3: '',
        price4: ''
      }),
      brands: new FormArray([]),
      categories: this.fb.group({}),
      productCase: this.fb.group({})
    })   
  }
  itemSelected(selected: { name: string; value: string; isAdded: boolean }, name?: string) {
    console.log('Brands', this.brands);
    
    if (selected.isAdded) {
      this.queryParams[name!].add(selected.value);
    } else {
      this.queryParams[name!].delete(selected.value);
    }
    
    const params = this.buildParams(this.queryParams);
    this.router.navigate(['/servers'], {
      queryParams: params,
      replaceUrl: true,
    });
  }

  compareEvent() {
    this.router.navigateByUrl('/compare')
  }

  onSelect(product: ProductItem) {
    this.selectedProducts = this.selectedProducts.filter(
      (pdt) => product.id !== pdt.id
    );
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
    const keys = [
      'price',
      'brand',
      'categories',
      'productCase',
      'query',
    ];
    let paramMap: Record<string, string> = { page: '0', size: '9' };
    for (let key of keys) {
      const keyValues = Array.from(params[key]);
      if (keyValues.length !== 0) {
        paramMap[key] = `${keyValues.join(',')}`;
      }
    }
    return paramMap;
  }

  clearFilters() {
    this.onLoad();
    this.router.navigate(['/servers'], { queryParams: this.initialParams})
  }

  get productType() {
    return this.filterForm.get('productType')!;
  }

  get price() {
    return this.filterForm.get('price') as FormArray
  }

  get brands() {
    return this.filterForm.controls['brands'] as FormArray
  }
}
