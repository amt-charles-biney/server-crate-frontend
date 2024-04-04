import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  map,
  startWith,
  tap,
} from 'rxjs';
import {
  Select,
  LoadingStatus,
  ProductItem,
  BasicConfig,
  Case,
  ProductPayload,
} from '../../../../types';
import { Store } from '@ngrx/store';
import {
  selectCategories,
} from '../../../../store/admin/products/categories.reducers';
import {
  addProduct,
  deleteProduct,
  getCategories,
  getConfiguration,
  getProduct,
  resetConfiguration,
  resetProduct,
  updateProduct,
} from '../../../../store/admin/products/categories.actions';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { getUniqueId } from '../../../../core/utils/settings';
import {
  RxReactiveFormsModule,
  RxwebValidators,
} from '@rxweb/reactive-form-validators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { setLoadingSpinner } from '../../../../store/loader/actions/loader.actions';
import { AuthLoaderComponent } from '../../../../shared/components/auth-loader/auth-loader.component';
import { selectLoaderState } from '../../../../store/loader/reducers/loader.reducers';
import { selectCases, selectConfigurationState } from '../../../../store/admin/products/configuration.reducers';
import {
  productInitialState,
  selectProduct,
} from '../../../../store/admin/products/products.reducers';
import { CustomImageComponent } from '../../../../shared/components/custom-image/custom-image.component';
import { categoryIsNotUnassigned } from '../../../../core/utils/validators';
import { getCaseList } from '../../../../store/case/case.actions';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LoaderComponent } from '../../../../core/components/loader/loader.component';
import { ErrorComponent } from '../../../../shared/components/error/error.component';
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CustomInputComponent,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatAutocompleteModule,
    RxReactiveFormsModule,
    AuthLoaderComponent,
    CustomImageComponent,
    CustomSelectComponent,
    LoaderComponent,
    NgxUiLoaderModule,
    ErrorComponent
  ],
  templateUrl: './add-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductComponent implements OnInit, OnDestroy {
  addProductForm!: FormGroup;
  categories$!: Observable<Select[]>;
  cases$!: Observable<Case[]>;
  brands$!: Observable<Select[]>;
  private option$ = new Subject<BasicConfig>();
  private product$ = new BehaviorSubject<ProductItem>(
    productInitialState.product
  );
  private totalPrice$ = new BehaviorSubject<number>(-1);
  product = this.product$.asObservable();
  options = this.option$.asObservable();
  filteredOptions!: Observable<Select[]>;
  filteredBrandNames!: Observable<Select[]>;
  loadingState$!: Observable<LoadingStatus>;
  caseId!: string;
  url: any = '';
  id: string = '';
  coverImage: string | null = '';
  image1: string | null = '';
  image2: string | null = '';
  image3: string | null = '';
  formGroup = {};
  configurationPrice: number = 0;
  constructor(
    private store: Store,
    private fb: FormBuilder,
    private destroyRef: DestroyRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.store.dispatch(getCategories());
    this.store.dispatch(getCaseList());
    this.totalPrice$.next(0);
    this.formGroup = {
      productName: [
        '',
        RxwebValidators.required({ message: 'Please enter a product name' }),
      ],
      productDescription: [
        '',
        RxwebValidators.required({
          message: 'Please enter a product description',
        }),
      ],
      productPrice: [''],
      serviceCharge: [
        '0',
        RxwebValidators.required({ message: 'Please enter a charge' }),
      ],
      productId: `${getUniqueId(2)}`,
      category: ['', categoryIsNotUnassigned()],
      cases: [''],
      inStock: [0],
    };
    this.addProductForm = this.fb.group(this.formGroup);
    if (this.id) {
      this.store.dispatch(getProduct({ id: this.id }));
      this.product = this.store.select(selectProduct).pipe(
        tap((data: ProductItem) => {
          if (data.category.id) {
            this.store.dispatch(
              getConfiguration({
                name: data.category.name,
                id: data.category.id,
              })
            );
          }
          this.formGroup = {
            productName: data.productName,
            productDescription: data.productDescription,
            productPrice: data.productPrice,
            cases: {
              name: data.productBrand.name,
              price: data.productBrand.price
            },
            productId: data.productId,
            inStock: data.inStock,
            category: {
              name: data.category.name,
              id: data.category.id,
            },
            serviceCharge: data.serviceCharge,
          };
          this.addProductForm.patchValue({ ...this.formGroup });
          setTimeout(() => {
            this.addProductForm.markAllAsTouched();
          }, 1);
        })
      );
    }
    this.categories$ = this.store.select(selectCategories).pipe(
      tap((categories) => {
        this.filteredOptions = this.category.valueChanges.pipe(
          startWith({ id: '', name: '' }),
          map((value) => {
            return this._filter(value, categories);
          })
        );
      })
    );

    this.cases$ = this.store.select(selectCases);

    this.loadingState$ = this.store.select(selectLoaderState);
    this.options = this.store.select(selectConfigurationState);

    combineLatest([
      this.addProductForm.controls['cases'].valueChanges.pipe(startWith('')),
      this.addProductForm.controls['serviceCharge'].valueChanges.pipe(
        startWith(0)
      ),
      this.store.select(selectConfigurationState),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([caseValue, serviceChargeValue, configuration]) => {
        let configPrice = 0;
        this.inStock.setValue(configuration.inStock)
        for (let key in configuration.options) {
          configuration.options[key].forEach((config) => {
            if (config.isIncluded) {
              configPrice += config.price;
            }
          });
        }
        this.configurationPrice = configPrice;
        const productPricing = (caseValue.price || 0) + configPrice;
        const calculatedPrice: number =
          (serviceChargeValue / 100) * productPricing + productPricing;
        this.price.setValue(calculatedPrice.toFixed(2));
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetConfiguration());
    this.store.dispatch(resetProduct());
  }

  deleteCategory(event: Event, option: Select) {
    event.stopPropagation();
  }

/**
 * The `_filter` function filters an array of `Select` objects based on a provided value.
 * @param {Select | string} value - The `value` parameter can be either of type `Select` or `string`.
 * @param {Select[]} filterFrom - The `filterFrom` parameter is an array of objects of type `Select`.
 * @returns {Select[]} The `_filter` function returns an array of `Select` objects that match the filter criteria
 * based on the `value` parameter.
 */
  private _filter(value: Select | string, filterFrom: Select[]): Select[] {
    return filterFrom.filter((option: Select) => {
      if (typeof value !== 'string') {
        return option.name.toLowerCase().includes(value.name.toLowerCase());
      }
      return option.name.toLowerCase().includes(value.toLowerCase());
    });
  }

/**
 * The `cancel()` function navigates to the '/admin/products' route using Angular's router.
 * @returns {void}
 */
  cancel(): void {
    this.router.navigateByUrl('/admin/products');
  }

 /**
  * The function `onCategorySelected` is triggered when a category is selected, dispatches an action to
  * get configuration data based on the selected category, and updates the options with the
  * configuration state.
  * @param {MatAutocompleteSelectedEvent} event - The `event` parameter in the `onCategorySelected`
  * function is of type `MatAutocompleteSelectedEvent`. This event is triggered when a user selects an
  * option from a material autocomplete dropdown.
  * @returns {void}
  */
  onCategorySelected(event: MatAutocompleteSelectedEvent): void {
    const selectedCategory: Select = event.option.value;
    this.store.dispatch(getConfiguration(selectedCategory));
    this.options = this.store.select(selectConfigurationState);
  }

 /**
  * The function `onSelectCase` assigns the selected case ID from a Material Select component to the
  * `caseId` property.
  * @param {MatSelectChange} event - The `event` parameter in the `onSelectCase` function is of type
  * `MatSelectChange`, which is an event emitted when the selected value of a `MatSelect` component
  * changes.
  * @returns {void}
  */
  onSelectCase(event: MatSelectChange): void {
    this.caseId = event.value.id;
  }

  /**
   * The `addProduct` function adds a new product to the store with the provided product
   * details.
   */
  addProduct() {
    if (this.addProductForm.invalid) return;
    this.store.dispatch(
      setLoadingSpinner({
        status: true,
        message: '',
        isError: false,
      })
    );
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
    const product: ProductPayload = {
      productName: this.productName.value,
      productDescription: this.productDescription.value,
      serviceCharge: this.serviceCharge.value,
      productId: this.addProductForm.value.productId,
      category: this.addProductForm.value.category.name,
      productCaseId: this.caseId,
      inStock: this.inStock.value,
    };
    if (this.id) {
      this.store.dispatch(updateProduct({ id: this.id, product }));
    } else {
      this.store.dispatch(addProduct(product));
    }
  }

  /**
   * The `deleteProduct` function scrolls to the top of the page smoothly and dispatches an action to
   * delete a product with the specified ID.
   * @param {string} id - The `id` parameter in the `deleteProduct` function is a string that
   * represents the unique identifier of the product that needs to be deleted.
   */
  deleteProduct(id: string) {
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
    this.store.dispatch(deleteProduct({ id }));
  }

  get category() {
    return this.addProductForm.get('category')!;
  }
  get cases() {
    return this.addProductForm.get('cases')!;
  }
  get productBrand() {
    return this.addProductForm.get('productBrand')!;
  }
  get productName() {
    return this.addProductForm.get('productName')!;
  }
  get productDescription() {
    return this.addProductForm.get('productDescription')!;
  }
  get inStock() {
    return this.addProductForm.get('inStock')!;
  }
  get price() {
    return this.addProductForm.get('productPrice')!;
  }
  get serviceCharge() {
    return this.addProductForm.get('serviceCharge')!;
  }
}
