import {
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, Subject, catchError, map, of, startWith, tap } from 'rxjs';
import {
  Category,
  LoadingStatus,
  Option,
  ProductItem,
} from '../../../../types';
import { Store } from '@ngrx/store';
import { selectCategoriesState } from '../../../../store/admin/products/categories.reducers';
import {
  deleteProduct,
  getCategories,
  getConfiguration,
  getProduct,
} from '../../../../store/admin/products/categories.actions';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { getUniqueId } from '../../../../core/utils/settings';
import {
  FormGroupExtension,
  RxFormBuilder,
  RxFormGroup,
  RxReactiveFormsModule,
} from '@rxweb/reactive-form-validators';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { setLoadingSpinner } from '../../../../store/loader/actions/loader.actions';
import { AuthLoaderComponent } from '../../../../shared/components/auth-loader/auth-loader.component';
import { selectLoaderState } from '../../../../store/loader/reducers/loader.reducers';
import { selectOptions } from '../../../../store/admin/products/configuration.reducers';
import { selectProduct } from '../../../../store/admin/products/products.reducers';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CustomInputComponent,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatAutocompleteModule,
    RxReactiveFormsModule,
    AuthLoaderComponent,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  addProductForm!: RxFormGroup;
  categories$!: Observable<Category[]>;
  private option$ = new Subject<Option>();
  private product$ = new Subject<ProductItem>();
  product = this.product$.asObservable();
  options = this.option$.asObservable();
  filteredOptions!: Observable<Category[]>;
  loadingState$!: Observable<LoadingStatus>;
  @ViewChild('coverImagePreview') coverImagePreview!: ElementRef;
  url: any = '';
  id: string | null = null;
  
  formGroup = {};
  constructor(
    private store: Store,
    private fb: RxFormBuilder,
    private adminService: AdminService,
    private destroyRef: DestroyRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.store.dispatch(getCategories());

    this.formGroup = {
      file: null,
      productName: [''],
      productDescription: [''],
      productPrice: [''],
      productId: [`${getUniqueId(2)}`],
      category: [''],
      inStock: 0,
    };
    this.addProductForm = <RxFormGroup>this.fb.group(this.formGroup);
    if (this.id) {
      console.log('id', this.id);

      this.store.dispatch(getProduct({ id: this.id }));
      this.store
        .select(selectProduct)
        .pipe(
          tap((data: ProductItem) => {
            console.log('Data', data);
            this.store.dispatch(getConfiguration({ categoryName: data.category.name , id: data.category.id}));
            this.formGroup = {
              file: null,
              productName: [data.productName],
              productDescription: [data.productDescription],
              productPrice: [data.productPrice],
              productId: [data.productId],
              inStock: [data.inStock],
              category: { categoryName: data.category.name , id: data.category.id},
            };
            if (this.coverImagePreview) {
              this.coverImagePreview.nativeElement.src = data.imageUrl;
            }
            this.addProductForm.setValue({ ...this.formGroup });
          }),
          takeUntilDestroyed(this.destroyRef),
          catchError((err) => {
            return of(err)
          }))
        .subscribe()
    }
    this.categories$ = this.store.select(selectCategoriesState).pipe(
      tap((categories) => {
        console.log('Categories', categories);

        this.filteredOptions = this.category.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value, categories))
        );
      })
    );
    this.loadingState$ = this.store.select(selectLoaderState);
    this.options = this.store.select(selectOptions);
    // if (this.router.url !== '/settings') {
    // }
    // this.router.navigateByUrl('/admin/add-product');
  }
  // learn and use generics later
  private _filter(value: Category, filterFrom: any): any {
    const filterValue =
      value && value.categoryName ? value.categoryName.toLowerCase() : '';
    return filterFrom.filter((option: any) =>
      option.categoryName.toLowerCase().includes(filterValue)
    );
  }
  onFocus() {
    console.log('focus');
  }

  cancel() {
    console.log('cancel');
    this.router.navigateByUrl('/admin/products')
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    console.log('event', event.option.value);
    const selectedCategory: Category = event.option.value;
    this.store.dispatch(getConfiguration(selectedCategory));
  }
  addProduct() {
    this.store.dispatch(
      setLoadingSpinner({
        status: true,
        message: '',
        isError: false,
      })
    );
    scrollTo({ top: 0, behavior: 'smooth' });
    const formData: FormData = (<FormGroupExtension>(
      this.addProductForm
    )).toFormData();
    formData.forEach((val: FormDataEntryValue, key: string) => {
      console.log(`Val ${val} key ${key}`);
    });
    const file = formData.get('file[0]');
    const category = formData.get('category[categoryName]');
    formData.delete('file[0]');
    formData.delete('category[categoryName]');
    formData.delete('category[id]');
    formData.set('file', file!);
    formData.set('category', category!);
    formData.forEach((val: FormDataEntryValue, key: string) => {
      console.log(`After Val ${val} key ${key}`);
    });

    this.adminService
      .addProduct(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          console.log('Received', data);
        },
        error: (err) => {
          console.log('err', err);
          this.store.dispatch(
            setLoadingSpinner({
              status: false,
              message: err.error?.detail || 'Internal Server Error',
              isError: true,
            })
          );
        },
        complete: () => {
          this.store.dispatch(
            setLoadingSpinner({
              status: false,
              message: 'Added Product',
              isError: false,
            })
          );
          setTimeout(() => {
            this.router.navigateByUrl('/admin/products');
          }, 1500);
        },
      });
  }

  uploadDocument(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        this.coverImagePreview.nativeElement.src = '/assets/uploading.svg';
        console.log('Loading image');
      };
      reader.onloadend = (event) => {
        console.log('image added');
        this.coverImagePreview.nativeElement.src = reader.result;
      };
    }
  }
  removeImage() {
    this.coverImagePreview.nativeElement.src = '';
    this.addProductForm.patchValue({ file: null });
  }

  deleteProduct(id: string) {
    this.store.dispatch(deleteProduct({ id }));
  }

  get category() {
    return this.addProductForm.get('category')!;
  }

  get brandName() {
    return this.addProductForm.get('brandName')!;
  }
}
