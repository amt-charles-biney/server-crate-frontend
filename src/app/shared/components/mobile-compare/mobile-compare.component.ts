import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Comparison, Product, SelectedDropdown } from '../../../types';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BehaviorSubject, map, startWith, tap } from 'rxjs';
import {
  selectProducts,
  selectSingleProduct,
} from '../../../store/admin/products/products.reducers';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { getSingleProduct } from '../../../store/admin/products/categories/categories.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-compare',
  standalone: true,
  imports: [
    CustomInputComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './mobile-compare.component.html',
  styleUrl: './mobile-compare.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileCompareComponent implements OnInit, OnChanges {
  @Input() allProducts!: Product[];
  @Input() productsToCompare!: Comparison[];

  private filteredProducts$ = new BehaviorSubject<Product[]>([]);
  filteredProducts = this.filteredProducts$.asObservable();

  copyOfAllProducts!: Product[];
  copyOfComparisons!: Comparison[];
  comparisonProductsGroup!: FormGroup;

  prevSelectedFirstProduct!: Product;
  prevSelectedSecondProduct!: Product;

  paddingTop: string = 'pt-[40px]'

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef,
    private destroyRef: DestroyRef,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.comparisonProductsGroup = new FormGroup({
      firstProduct: new FormControl(),
      secondProduct: new FormControl(),
    });
    this.store
      .select(selectProducts)
      .pipe(
        tap((products) => {
          this.filteredProducts$.next(products);
          this.copyOfAllProducts = products;
          this.firstProduct.valueChanges.pipe(
            startWith(''),
            map((value) => {
              return this._filter(value, this.filteredProducts$.value);
            })
          );
          this.secondProduct.valueChanges.pipe(
            startWith(''),
            map((value) => {
              return this._filter(value, this.filteredProducts$.value);
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
    this.store
      .select(selectSingleProduct)
      .pipe(
        tap((product) => {
          if (product) {
            this.copyOfComparisons = [...this.copyOfComparisons, product];
            
            this.cdr.markForCheck();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['allProducts']) {
      this.copyOfAllProducts = changes['allProducts'].currentValue;
    }
    if (changes && changes['productsToCompare']) {
      this.copyOfComparisons = changes['productsToCompare'].currentValue;
    }

    if (
      this.copyOfComparisons.length > 0 &&
      this.copyOfAllProducts.length > 0
    ) {
      this.createNewDropdownList(
        this.productsToCompare.map((product) => product.productName),
        this.copyOfAllProducts
      );
      const firstProduct = this.copyOfComparisons[0];
      const secondProduct = this.copyOfComparisons[1];

      if (this.comparisonProductsGroup) {
        this.comparisonProductsGroup.patchValue({
          firstProduct,
          secondProduct,
        });
      }
      this.prevSelectedFirstProduct = {
        name: firstProduct.productName,
        id: firstProduct.productId,
      };
      this.prevSelectedSecondProduct = {
        name: secondProduct.productName,
        id: secondProduct.productId,
      };
      
    }
  }

  private _filter(value: Product | string, filterFrom: Product[]): Product[] {
    return filterFrom.filter((option: Product) => {
      if (typeof value !== 'string') {
        return option.name.toLowerCase().includes(value.name.toLowerCase());
      }
      return option.name.toLowerCase().includes(value.toLowerCase());
    });
  }
  onProductSelected(
    event: MatAutocompleteSelectedEvent,
    whichProductDropdown: SelectedDropdown
  ) {
    const selectedItem = event.option.value;
    

    if (selectedItem === 'Clear') {
      this.putBackClearedProduct(whichProductDropdown);
    } else {
      this.store.dispatch(getSingleProduct({ id: selectedItem.id }));
      this.assignPreviousValues(whichProductDropdown, selectedItem);
    }

    this.createNewDropdownList(
      [this.firstProduct.value?.name, this.secondProduct.value?.name],
      this.copyOfAllProducts
    );
  }

  createNewDropdownList(
    productsToFilter: string[],
    arrayToFilterFrom: Product[]
  ) {
    const newFilteredProducts = this.filterOutProducts(
      productsToFilter,
      arrayToFilterFrom
    );
    this.filteredProducts$.next(newFilteredProducts);
  }

  getOptionsData(attributeName: string, productColumn: 1 | 2) {
    if (productColumn === 1) {
      const product = this.copyOfComparisons.find(
        (compareProduct) =>
          compareProduct.productName ===
          (this.firstProduct.value?.name ??
            this.firstProduct.value?.productName)
      );

      return product?.options[attributeName] || 'n/a';
    }
    const product = this.copyOfComparisons.find(
      (compareProduct) =>
        compareProduct.productName ===
        (this.secondProduct.value?.name ??
          this.secondProduct.value?.productName)
    );
    return product?.options[attributeName] || 'n/a';
  }

  assignPreviousValues(
    whichProductDropdown: SelectedDropdown,
    selectedProduct: Product
  ) {
    

    if (whichProductDropdown === 'firstProduct') {
      this.prevSelectedFirstProduct = selectedProduct;
    } else if (whichProductDropdown === 'secondProduct') {
      this.prevSelectedSecondProduct = selectedProduct;
    }
  }

  filterOutProducts(productsToFilter: string[], arrayToFilterFrom: Product[]) {
    const productsToFilterOut = productsToFilter;
    

    return arrayToFilterFrom.filter(
      (pdt) => !productsToFilterOut.includes(pdt.name)
    );
  }

  putBackClearedProduct(whichProductDropdown: SelectedDropdown) {
    
    
    
    
    if (whichProductDropdown === 'firstProduct') {
      this.copyOfAllProducts = [
        ...this.filteredProducts$.value,
        this.prevSelectedFirstProduct,
      ];
    } else {
      this.copyOfAllProducts = [
        ...this.filteredProducts$.value,
        this.prevSelectedSecondProduct,
      ];
    }
  }

  deleteAndReturn(products: Product[], productToDelete: Product) {
    const filteredProducts = products.filter(
      (pdt) => !pdt.name.startsWith(productToDelete.name)
    );

    return [productToDelete, filteredProducts];
  }

  goToConfiguration(id: string) {
    this.router.navigate([`/product/configure/${id}`])
  }

  get firstProduct() {
    return this.comparisonProductsGroup.get('firstProduct')! as FormControl;
  }

  get secondProduct() {
    return this.comparisonProductsGroup.get('secondProduct')! as FormControl;
  }
}
