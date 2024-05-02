import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Comparison,
  Product,
  Select,
} from '../../types';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CloudinaryUrlPipe } from '../../shared/pipes/cloudinary-url/cloudinary-url.pipe';
import { Store } from '@ngrx/store';
import {
  addToWishlist,
  getAllProducts,
  getSingleProduct,
} from '../../store/admin/products/categories.actions';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { BehaviorSubject, Observable, map, of, startWith, tap } from 'rxjs';
import {
  selectProducts,
  selectSingleProduct,
} from '../../store/admin/products/products.reducers';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { getProductComparisons } from '../../store/compare/compare.actions';
import { selectData } from '../../store/compare/compare.reducers';
import { isInStorage } from '../../core/utils/helpers';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MobileCompareComponent } from '../../shared/components/mobile-compare/mobile-compare.component';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [
    NgOptimizedImage,
    CloudinaryUrlPipe,
    CustomInputComponent,
    ReactiveFormsModule,
    CommonModule,
    MatAutocompleteTrigger,
    MatAutocompleteModule,
    MobileCompareComponent
  ],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompareComponent implements OnInit {
  private productsToCompare$ = new BehaviorSubject<Comparison[]>([]);
  private allProducts$ = new BehaviorSubject<Product[]>([]);
  private singleProduct$ = new BehaviorSubject<Comparison | null>(null);

  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) trigger!: MatAutocompleteTrigger;

  productsToCompare = this.productsToCompare$.asObservable();
  allProducts = this.allProducts$.asObservable();
  singleProduct = this.singleProduct$.asObservable();
  filteredOptions!: Observable<Product[]>;

  products: Comparison[] = [];
  productList!: FormGroup;

  constructor(private store: Store, private toast: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(getProductComparisons());
    this.store.dispatch(getAllProducts());
    this.productList = new FormGroup({
      product: new FormControl(''),
    });
    this.onInit();
  }

  onInit() {
    this.productsToCompare = this.store.select(selectData).pipe(
      tap((productsToCompare) => {
        this.products = productsToCompare;
      })
    );

    this.allProducts = this.store.select(selectProducts).pipe(
      tap((products) => {
        this.filteredOptions = this.product.valueChanges.pipe(
          startWith(''),
          map((value) => {
            return this._filter(value, products);
          })
        );
      })
    );
    this.singleProduct = this.store.select(selectSingleProduct).pipe(
      tap((product) => {
        if (product) {
          this.products = [...this.products, product];
        }
      })
    );
  }

  private _filter(value: Product | string, filterFrom: Product[]): Product[] {
    return filterFrom.filter((option: Product) => {
      if (typeof value !== 'string') {
        return option.name.toLowerCase().includes(value.name.toLowerCase());
      }
      return option.name.toLowerCase().includes(value.toLowerCase());
    });
  }

  addToWishlist(id: string) {
    this.store.dispatch(addToWishlist({ id, configOptions: { components: '', warranty: false } }));
  }

  onProductSelect(event: MatAutocompleteSelectedEvent) {
    const selectedProduct: Product = event.option.value;
    if (!isInStorage(selectedProduct.id).inStorage) {
      this.store.dispatch(getSingleProduct({ id: selectedProduct.id }));
      this.product.setValue('');
      this.addToCompare(selectedProduct.id);
    } else {
      this.toast.info('Product is already here', 'Duplicate', {
        timeOut: 1500,
      });
    }
  }
  displayFn(option: Select): string {    
    return option && option.name ? option.name : ''
  }

  openPanel(event: any) {
    event.stopPropagation()    
    this.trigger.openPanel()
  }

  addToCompare(id: string) {
    const { inStorage, productsInStorage } = isInStorage(id);
    if (!inStorage) {
      sessionStorage.setItem(
        'products',
        JSON.stringify({ ...productsInStorage, [id]: true })
      );
    }
  }

  clearSelections() {
    sessionStorage.setItem('products', JSON.stringify({}));
    this.productsToCompare = of([]);
    this.products = [];
  }

  goToConfiguration(id: string) {
    this.router.navigate([`/product/configure/${id}`])
  }

  get product() {
    return this.productList.get('product')!;
  }
}
