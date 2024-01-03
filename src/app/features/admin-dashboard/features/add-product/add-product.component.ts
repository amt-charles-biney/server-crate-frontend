import {
  ChangeDetectionStrategy,
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
import { CustomImageComponent } from '../../../../shared/components/custom-image/custom-image.component';

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
    CustomImageComponent,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  url: any = '';
  id: string = '';
  coverImage: string | null = '';
  image1: string | null = '';
  image2: string | null = '';
  image3: string | null = '';
  formGroup = {};
  constructor(
    private store: Store,
    private fb: RxFormBuilder,
    private adminService: AdminService,
    private destroyRef: DestroyRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.store.dispatch(getCategories());

    this.formGroup = {
      file: null,
      coverImage: null,
      productName: '',
      productDescription: '',
      productPrice: '',
      productId: `${getUniqueId(2)}`,
      category: '',
      inStock: 0,
      image1: null,
      image2: null,
      image3: null,
    };
    this.addProductForm = <RxFormGroup>this.fb.group(this.formGroup);
    if (this.id) {
      console.log('id', this.id);
      this.store.dispatch(getProduct({ id: this.id }));
      this.store
        .select(selectProduct)
        .pipe(
          tap((data: ProductItem) => {
            if (data.category.id) {
              this.store.dispatch(
                getConfiguration({
                  categoryName: data.category.name,
                  id: data.category.id,
                })
              );
            }
            console.log('Data', data);
            this.formGroup = {
              file: null,
              coverImage: null,
              productName: data.productName,
              productDescription: data.productDescription,
              productPrice: data.productPrice,
              productId: data.productId,
              inStock: data.inStock,
              category: {
                categoryName: data.category.name,
                id: data.category.id,
              },
              image1: null,
              image2: null,
              image3: null,
            };

            this.coverImage = data.coverImage;
            this.image1 = data.imageUrl[0];
            this.image2 = data.imageUrl[1];
            this.image3 = data.imageUrl[2];

            this.addProductForm.setValue({ ...this.formGroup });
          }),
          takeUntilDestroyed(this.destroyRef),
          catchError((err) => {
            return of(err);
          })
        )
        .subscribe();
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
  // TODO: use generics
  private _filter(value: Category, filterFrom: any): any {
    const filterValue =
      value && value.categoryName ? value.categoryName.toLowerCase() : '';
    return filterFrom.filter((option: any) =>
      option.categoryName.toLowerCase().includes(filterValue)
    );
  }

  cancel() {
    this.router.navigateByUrl('/admin/products');
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
    // formData.forEach((val: FormDataEntryValue, key: string) => {
    //   console.log(`Val ${val} key ${key}`);
    // });
    const coverImage = formData.get('coverImage[0]');
    const image1 = formData.get('image1[0]');
    const image2 = formData.get('image2[0]');
    const image3 = formData.get('image3[0]');
    const category = formData.get('category[categoryName]');

    formData.delete('coverImage[0]');
    formData.delete('image1[0]');
    formData.delete('image2[0]');
    formData.delete('image3[0]');
    formData.delete('category[categoryName]');
    formData.delete('category[id]');
    formData.delete('file[0]');

    formData.set('coverImage', coverImage!);
    formData.set('category', category!);
    formData.append('file', image1!);
    formData.append('file', image2!);
    formData.append('file', image3!);

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
              message:
                err.error?.detail || 'Please enter all the required data',
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

  replaceImage(obj: { imgSrc: string; imageToChange: string }) {
    const setterFunctions: Record<string, (src: string) => void> = {
      coverImage: (src: string) => {
        this.coverImage = src;
      },
      image1: (src: string) => {
        this.image1 = src;
      },
      image2: (src: string) => {
        this.image2 = src;
      },
      image3: (src: string) => {
        this.image3 = src;
      },
    };

    const setter = setterFunctions[obj.imageToChange];
    if (setter) {
      setter(obj.imgSrc);
    }
  }
  removeImage(imageToRemove: string) {
    console.log('Removing image');
    if (imageToRemove === 'coverImage') {
      this.removeCoverImage();
    } else if (imageToRemove === 'image1') {
      this.removeImage1();
    } else if (imageToRemove === 'image2') {
      this.removeImage2();
    } else {
      this.removeImage3();
    }
  }
  removeCoverImage() {
    this.addProductForm.patchValue({ coverImage: null });
    this.coverImage = null;
  }
  removeImage1() {
    this.addProductForm.patchValue({ image1: null });
    this.image1 = null;
  }
  removeImage2() {
    this.addProductForm.patchValue({ image2: null });
    this.image2 = null;
  }
  removeImage3() {
    this.addProductForm.patchValue({ image3: null });
    this.image3 = null;
  }

  deleteProduct(id: string) {
    scrollTo({ top: 0, behavior: 'smooth' });
    this.store.dispatch(deleteProduct({ id }));
  }

  get category() {
    return this.addProductForm.get('category')!;
  }

}
