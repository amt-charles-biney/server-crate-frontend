import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Comparison, Product, ProductItem, ProductItemSubset } from '../../types';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CloudinaryUrlPipe } from '../../shared/pipes/cloudinary-url/cloudinary-url.pipe';
import { Store } from '@ngrx/store';
import { addToWishlist, getAllProducts, getSingleProduct } from '../../store/admin/products/categories.actions';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { BehaviorSubject, Observable, map, of, startWith, tap } from 'rxjs';
import { selectAllProductsState, selectProducts, selectSingleProduct } from '../../store/admin/products/products.reducers';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { getProductComparisons } from '../../store/compare/compare.actions';
import { selectData } from '../../store/compare/compare.reducers';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [NgOptimizedImage, CloudinaryUrlPipe, CustomInputComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompareComponent implements OnInit {
  private productsToCompare$ = new BehaviorSubject<Comparison[]>([]);
  private allProducts$ = new BehaviorSubject<Product[]>([])
  private singleProduct$ = new BehaviorSubject<Comparison | null>(null)
  
  filteredOptions!: Observable<Product[]>;
  allProducts = this.allProducts$.asObservable()
  singleProduct = this.singleProduct$.asObservable()
  productsToCompare = this.productsToCompare$.asObservable()

  products: Comparison[] = []

  productList!: FormGroup

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(getProductComparisons())
    this.store.dispatch(getAllProducts())
    this.productList = new FormGroup({
      product: new FormControl('')
    })
    this.onInit()
  }

  onInit() {

    this.productsToCompare = this.store.select(selectData).pipe(
      tap((productsToCompare) => {
        this.products = productsToCompare
      })
    )
    // const products: string = localStorage.getItem("products") ? localStorage.getItem("products")! : "[]"
    // this.productsToCompare.next(JSON.parse(products));

    this.allProducts = this.store.select(selectProducts).pipe(
      tap((products) => {
        console.log('Products', products);
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
          this.products = [...this.products, product]
        }
      })
    )
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
    this.store.dispatch(addToWishlist({ id }));
  }

  onProductSelect(event: MatAutocompleteSelectedEvent) {
    const selectedProduct: Product = event.option.value;
    console.log('Selected product', selectedProduct);
    this.store.dispatch(getSingleProduct({ id: selectedProduct.id }))
    // this.addToCompare({...selectedProduct})
    this.onInit()
  }

  addToCompare(product: ProductItemSubset) {
    let productsForComparison:ProductItemSubset[] = [product];
    if (localStorage.getItem("products")) {
      const productsInStorage = JSON.parse(localStorage.getItem("products")!)
    productsForComparison = [...productsInStorage, product]
    }

    localStorage.setItem('products', JSON.stringify(productsForComparison)); 
    
  }

  clearSelections() {
    localStorage.setItem("products", JSON.stringify({}))
    this.productsToCompare = of([])
  }

  get product() {
    return this.productList.get('product')!
  }
}
