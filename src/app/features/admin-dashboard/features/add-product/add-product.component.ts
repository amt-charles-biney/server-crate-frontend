import { Component, DestroyRef, OnInit } from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { MatSelectModule } from '@angular/material/select';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, map, startWith, tap } from 'rxjs';
import { DummyCategory } from '../../../../types';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { selectCategoriesState } from '../../../../store/admin/products/categories.reducers';
import { getCategories } from '../../../../store/admin/products/categories.actions';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { getUniqueId } from '../../../../core/utils/settings';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CustomInputComponent,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatAutocompleteModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  addProductForm!: FormGroup;
  categories$!: Observable<DummyCategory[]>;
  filteredOptions!: Observable<DummyCategory[]>;
  coverImaged = ''
  image1 = ''
  image2 = ''
  image3 = ''
  constructor(private store: Store, private destroyRef: DestroyRef) {}
  ngOnInit(): void {
    this.store.dispatch(getCategories());
    this.addProductForm = new FormGroup({
      productName: new FormControl('', [Validators.required]),
      productDescription: new FormControl(''),
      category: new FormControl('', [Validators.required]),
      brandName: new FormControl('', [Validators.required]),
      productId: new FormControl(`#${getUniqueId(2)}`, [Validators.required]),
      inStock: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
    });


    this.categories$ = this.store.select(selectCategoriesState).pipe(
      tap((categories) => {
        this.filteredOptions = this.category.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value, categories))
        );
      })
    );
  }
  // learn and use generics later
  private _filter(value: string, filterFrom: any): any {
    const filterValue = value.toLowerCase();
    return filterFrom.filter((option: any) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  changeCurrentSelection(
    event: MatOptionSelectionChange<DummyCategory>,
    category: DummyCategory
  ) {
    console.log('Selected', category);
  }

  addProduct() {
    console.log('Add product', this.addProductForm.value)
  }

  uploadDocument(event: any, controlName: AbstractControl) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
      controlName?.setValue(event.target.files[0]);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  get category() {
    return this.addProductForm.get('category')!;
  }
  
  get brandName() {
    return this.addProductForm.get('brandName')!;
  }
}
