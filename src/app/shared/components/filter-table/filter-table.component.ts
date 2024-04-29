import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { CustomCheckBoxComponent } from '../custom-check-box/custom-check-box.component';
import { Select } from '../../../types';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectBrands,
  selectCases,
  selectCategories,
} from '../../../store/admin/products/categories.reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { getUserProducts } from '../../../store/admin/products/categories.actions';

@Component({
  selector: 'app-filter-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    CustomCheckBoxComponent,
    CommonModule,
  ],
  templateUrl: './filter-table.component.html',
})
export class FilterTableComponent implements OnInit {
  filterForm!: FormGroup;
  queryParams!: Record<string, Set<string>>;

  brands$!: Observable<Select[]>;
  categories$!: Observable<Select[]>;
  cases$!: Observable<Select[]>;

  localBrands: Select[] = [];
  localCategories: Select[] = [];
  localCases: Select[] = [];

  initialParams: Record<string, string> = { page: '0', size: '9' };
  defaultPriceData = {
    price1: { name: '0-500', checked: false },
    price2: { name: '500-1000', checked: false },
    price3: { name: '1000-1500', checked: false },
    price4: { name: '> 1500', checked: false },
  };

  includedBrand!: string;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.onLoad()
    this.brands$ = this.store.select(selectBrands).pipe(
      tap((brands) => {
        this.localBrands = brands;
        brands.forEach((brand) =>
          this.brands.push(
            new FormControl({ name: brand.name, checked: false })
          )
        );
        this.getFiltersFromQuery(this.initialParams['brand'], this.brands);
      })
    );

    this.categories$ = this.store.select(selectCategories).pipe(
      tap((categories) => {
        this.localCategories = categories;
        categories.forEach((category) =>
          this.categories.push(
            new FormControl({ name: category.name, checked: false })
          )
        );
        this.getFiltersFromQuery(
          this.initialParams['categories'],
          this.categories
        );
      })
    );
    this.cases$ = this.store.select(selectCases).pipe(
      tap((cases) => {
        this.localCases = cases;
        cases.forEach((productCase) =>
          this.cases.push(
            new FormControl({ name: productCase.name, checked: false })
          )
        );
        this.getFiltersFromQuery(this.initialParams['productCase'], this.cases);
      })
    );

    this.activatedRoute.queryParams.subscribe((params) => {
      for (let key in params) {
        if (key !== 'page' && key !== 'size') {
          params[key].split(',').forEach((param: string) => {
            this.queryParams[key].add(param);
          });
        }
      }

      this.getFiltersFromQuery(params['brand'], this.brands);
      this.getFiltersFromQuery(params['categories'], this.categories);
      this.getFiltersFromQuery(params['productCase'], this.cases);
      const controls = this.price.controls;
      if (params['price']) {
        for (let control in controls) {
          const controlName = controls[control].value.name;
          params['price'].split(',').forEach((param: string) => {
            if (controlName === param) {
              controls[control].patchValue({
                name: controlName,
                checked: true,
              });
            }
          });
        }
      }

      this.initialParams = params;
      this.includedBrand = params['brand'] || '';
      this.store.dispatch(
        getUserProducts({
          page: 0,
          params: { ...this.initialParams, ...params },
        })
      );
    });
  }

  onLoad() {
    this.queryParams = {
      price: new Set(),
      brand: new Set(),
      categories: new Set(),
      productCase: new Set(),
      query: new Set(),
    };

    this.filterForm = this.fb.group({
      price: this.fb.group(this.defaultPriceData),
      brands: new FormArray([]),
      categories: new FormArray([]),
      productCase: new FormArray([]),
    });
  }
  itemSelected(
    selected: { name: string; value: string; isAdded: boolean },
    name?: string
  ) {
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

  clearFilters() {
    this.initialParams = {}
    this.queryParams = {
      price: new Set(),
      brand: new Set(),
      categories: new Set(),
      productCase: new Set(),
      query: new Set(),
    };

    this.price.patchValue(this.defaultPriceData)
    this.uncheck(this.cases)
    this.uncheck(this.categories)
    this.uncheck(this.brands)
    this.router.navigate(['/servers'], { queryParams: this.initialParams, replaceUrl: true })
  }

  buildParams(params: Record<string, Set<string>>) {
    const keys = ['price', 'brand', 'categories', 'productCase', 'query'];
    let paramMap: Record<string, string> = { page: '0', size: '9' };
    for (let key of keys) {
      const keyValues = Array.from(params[key]);
      if (keyValues.length !== 0) {
        paramMap[key] = `${keyValues.join(',')}`;
      }
    }
    return paramMap;
  }

  getFiltersFromQuery(query: string, formArray: FormArray) {
    if (query) {
      const queryArray = query.split(',');
      if (queryArray.length === 1) {
        formArray.value.forEach(
          (element: { name: string; checked: boolean }, index: number) => {
            if (element.name === queryArray[0]) {
              formArray.controls[index].patchValue({
                name: queryArray[0],
                checked: true,
              });
            } else {
              formArray.controls[index].patchValue({
                name: element.name,
                checked: false,
              });
            }
          }
        );
      } else {
        queryArray.forEach((filter) => {
          formArray.value.forEach(
            (element: { name: string; checked: boolean }, index: number) => {
              if (element.name === filter) {
                formArray.controls[index].patchValue({
                  name: filter,
                  checked: true,
                });
              }
            }
          );
        });
      }
    } else {
      this.uncheck(formArray);
    }
  }

  uncheck(formArray: FormArray) {
    formArray.value.forEach(
      (element: { name: string; checked: boolean }, index: number) => {
        formArray.controls[index].patchValue({
          name: element.name,
          checked: false,
        });
      }
    );
  }

  get productType() {
    return this.filterForm.get('productType')!;
  }

  get price() {
    return this.filterForm.get('price') as FormGroup;
  }

  get brands() {
    return this.filterForm.controls['brands'] as FormArray;
  }

  get categories() {
    return this.filterForm.controls['categories'] as FormArray;
  }

  get cases() {
    return this.filterForm.controls['productCase'] as FormArray;
  }
}
