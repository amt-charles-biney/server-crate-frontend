import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, Subject, catchError, map, of, startWith, tap } from 'rxjs';
import { Select, LoadingStatus, ProductItem, BasicConfig, Case } from '../../../../types';
import { Store } from '@ngrx/store';
import {
  selectBrands,
  selectCategories,
} from '../../../../store/admin/products/categories.reducers';
import {
  addBrand,
  deleteBrand,
  deleteProduct,
  getBrands,
  getCategories,
  getConfiguration,
  getProduct,
  resetConfiguration,
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
  RxwebValidators,
} from '@rxweb/reactive-form-validators';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { setLoadingSpinner } from '../../../../store/loader/actions/loader.actions';
import { AuthLoaderComponent } from '../../../../shared/components/auth-loader/auth-loader.component';
import { selectLoaderState } from '../../../../store/loader/reducers/loader.reducers';
import { selectConfigurationState } from '../../../../store/admin/products/configuration.reducers';
import { selectProduct } from '../../../../store/admin/products/products.reducers';
import { CustomImageComponent } from '../../../../shared/components/custom-image/custom-image.component';
import { categoryIsNotUnassigned } from '../../../../core/utils/validators';
import { getCases } from '../../../../store/case/case.actions';
import { selectCaseFeatureState } from '../../../../store/case/case.reducers';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select.component';

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
    CustomSelectComponent
  ],
  templateUrl: './add-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductComponent implements OnInit, OnDestroy {
  addProductForm!: RxFormGroup;
  categories$!: Observable<Select[]>;
  cases$!: Observable<Case[]>;
  brands$!: Observable<Select[]>;
  private option$ = new Subject<BasicConfig>();
  private product$ = new Subject<ProductItem>();
  product = this.product$.asObservable();
  options = this.option$.asObservable();
  filteredOptions!: Observable<Select[]>;
  filteredBrandNames!: Observable<Select[]>;
  loadingState$!: Observable<LoadingStatus>;
  url: any = '';
  id: string = '';
  coverImage: string | null = '';
  image1: string | null = '';
  image2: string | null = '';
  image3: string | null = '';
  formGroup = {};
  configurationPrice!: number
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
    this.store.dispatch(getCases());

    this.formGroup = {
      file: null,
      coverImage: null,
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
      productPrice: [
        '',
        RxwebValidators.required({ message: 'Please enter a price' }),
      ],
      serviceCharge: [
        '',
        RxwebValidators.required({ message: 'Please enter a charge' }),
      ],
      productId: `${getUniqueId(2)}`,
      productBrand: '',
      category: ['', categoryIsNotUnassigned()],
      cases: [''],
      inStock: [
        0,
        RxwebValidators.required({
          message: 'Please enter total products available',
        }),
      ],
      image1: null,
      image2: null,
      image3: null,
    };
    this.addProductForm = <RxFormGroup>this.fb.group(this.formGroup);
    if (this.id) {
      this.addProductForm.markAllAsTouched()
      this.store.dispatch(getProduct({ id: this.id }));
      this.store
        .select(selectProduct)
        .pipe(
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
              file: null,
              coverImage: null,
              productName: data.productName,
              productDescription: data.productDescription,
              productPrice: data.productPrice,
              productBrand: {
                name: data.productBrand,
              },
              productId: data.productId,
              inStock: data.inStock,
              category: {
                name: data.category.name,
                id: data.category.id,
              },
              image1: null,
              image2: null,
              image3: null,
            };

            this.coverImage = data.coverImage;
            this.image1 = data.imageUrl[0] || null;
            this.image2 = data.imageUrl[1] || null;
            this.image3 = data.imageUrl[2] || null;

            this.addProductForm.patchValue({ ...this.formGroup });
          }),
          takeUntilDestroyed(this.destroyRef),
          catchError((err) => {
            return of(err);
          })
        )
        .subscribe();
    }
    this.categories$ = this.store.select(selectCategories).pipe(
      tap((categories) => {

        this.filteredOptions = this.category.valueChanges.pipe(
          startWith({ id: '', name: ''}),
          map((value) => {
            return this._filter(value, categories)
          })
        );
      })
    );

    this.cases$ = this.store.select(selectCaseFeatureState)

    this.brands$ = this.store.select(selectBrands).pipe(
      tap((brands) => {

        this.filteredBrandNames = this.productBrand.valueChanges.pipe(
          startWith({ id: '', name: ''}),
          map((value) => this._filter(value, brands))
        );
      })
    );

    this.loadingState$ = this.store.select(selectLoaderState);
    this.options = this.store.select(selectConfigurationState);
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetConfiguration())
  }

  deleteBrand(event:Event, option: Select) {
    event.stopPropagation()
    this.store.dispatch(deleteBrand({ id: option.id }))
  }
  
  deleteCategory(event:Event, option: Select) {
    event.stopPropagation()
  }

  private _filter(value: Select | string, filterFrom: Select[]) {     
    return filterFrom.filter((option: Select) => {      
        if (typeof(value) !== 'string'){
        return option.name.toLowerCase().includes(value.name.toLowerCase());
      }
      return option.name.toLowerCase().includes(value.toLowerCase());
      });
  }

  cancel() {
    this.router.navigateByUrl('/admin/products');
  }

  addNewBrand() {
    const brandName = this.productBrand.value
    if (brandName) {
      if (this.id) {
        this.store.dispatch(addBrand({ name:  brandName }))
      } else {
        this.store.dispatch(addBrand({ name:  brandName }))
      }
    }
  }

  onCategorySelected(event: MatAutocompleteSelectedEvent) {
    const selectedCategory: Select = event.option.value;
    this.store.dispatch(getConfiguration(selectedCategory));
    this.options = this.store.select(selectConfigurationState);
  }
  onBrandSelected(event: MatAutocompleteSelectedEvent) {
    const selectedCategory: Select = event.option.value;
  }

  onSelectCase(event: MatSelectChange) {
    console.log('Selected case', event.value);
    this.addProductForm.patchValue({ productPrice: event.value.price})
  }

  addProduct() {
    if (this.addProductForm.invalid) return;
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

    const coverImage = formData.get('coverImage[0]');
    const image1 = formData.get('image1[0]');
    const image2 = formData.get('image2[0]');
    const image3 = formData.get('image3[0]');
    const category = formData.get('category[name]');
    const productBrand = formData.get('productBrand[name]') || formData.get('productBrand');
    
    formData.delete('coverImage[0]');
    formData.delete('image1[0]');
    formData.delete('image2[0]');
    formData.delete('image3[0]');
    formData.delete('category[name]');
    formData.delete('category[id]');
    formData.delete('productBrand[name]');
    formData.delete('productBrand[id]');
    formData.delete('file[0]');

    formData.set('coverImage', coverImage!);
    formData.set('category', category!);
    formData.set('productBrand', productBrand!);
    formData.append('file', image1!);
    formData.append('file', image2!);
    formData.append('file', image3!);

    if (this.id) {
      this.adminService
        .updateProduct(this.id, formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          error: (err) => {
            this.store.dispatch(
              setLoadingSpinner({
                status: false,
                message:
                  err.error?.detail || 'Server response error',
                isError: true,
              })
            );
          },
          complete: () => {
            this.store.dispatch(
              setLoadingSpinner({
                status: false,
                message: 'Edited product successfully',
                isError: false,
              })
            );
            setTimeout(() => {
              this.router.navigateByUrl('/admin/products');
            }, 1500);
          },
        });
    } else {
      this.adminService
        .addProduct(formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          error: (err) => {
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
                message: 'Added product successfully',
                isError: false,
              })
            );
            setTimeout(() => {
              this.router.navigateByUrl('/admin/products');
            }, 1500);
          },
        });
    }
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
