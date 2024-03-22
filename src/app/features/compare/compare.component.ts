import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProductItem, ProductItemSubset } from '../../types';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CloudinaryUrlPipe } from '../../shared/pipes/cloudinary-url/cloudinary-url.pipe';
import { Store } from '@ngrx/store';
import { addToWishlist, getUserProducts } from '../../store/admin/products/categories.actions';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { BehaviorSubject, Observable, map, startWith, tap } from 'rxjs';
import { selectContent } from '../../store/admin/products/products.reducers';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [NgOptimizedImage, CloudinaryUrlPipe, CustomInputComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompareComponent implements OnInit {
  productsToCompare = new BehaviorSubject<ProductItemSubset[]>([]);
  filteredOptions!: Observable<ProductItemSubset[]>;
  private allProducts$ = new BehaviorSubject<ProductItem[]>([])
  allProducts = this.allProducts$.asObservable()

  productList!: FormGroup

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.productList = new FormGroup({
      product: new FormControl('')
    })
    this.onInit()
  }

  onInit() {

    this.store.dispatch(getUserProducts({ page: 0, params: {}}))
    const products: string = localStorage.getItem("products") ? localStorage.getItem("products")! : "[]"
    this.productsToCompare.next(JSON.parse(products));

    this.allProducts = this.store.select(selectContent).pipe(
      tap((products) => {
        this.filteredOptions = this.product.valueChanges.pipe(
          startWith(''),
          map((value) => {
            return this._filter(value, products);
          })
        );
      })
    );
  }

  private _filter(value: ProductItem | string, filterFrom: ProductItem[]): ProductItem[] {
    return filterFrom.filter((option: ProductItem) => {
      if (typeof value !== 'string') {
        return option.productName.toLowerCase().includes(value.productName.toLowerCase());
      }
      return option.productName.toLowerCase().includes(value.toLowerCase());
    });
  }

  addToWishlist(id: string) {
    this.store.dispatch(addToWishlist({ id }));
  }

  onProductSelect(event: MatAutocompleteSelectedEvent) {
    const selectedProduct = event.option.value;
    console.log('Selected product', selectedProduct);
    this.addToCompare({...selectedProduct})
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
    localStorage.setItem("products", JSON.stringify([]))
    this.onInit()
  }

  get product() {
    return this.productList.get('product')!
  }
}
