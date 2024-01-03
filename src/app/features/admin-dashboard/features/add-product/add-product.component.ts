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
    CustomImageComponent
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
  id: string = '';
  coverImage: string | null = ''
  image1: string | null = ''
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
    this.id = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.store.dispatch(getCategories());

    this.formGroup = {
      file: null,
      coverImage: null,
      productName: [''],
      productDescription: [''],
      productPrice: [''],
      productId: [`${getUniqueId(2)}`],
      category: [''],
      inStock: 0,
      image1: null
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
            this.store.dispatch(getConfiguration({ categoryName: data.category.name , id: data.category.id}));
          }
            console.log('Data', data);
            this.formGroup = {
              file: null,
              coverImage: null,
              productName: [data.productName], 
              productDescription: [data.productDescription],
              productPrice: [data.productPrice],
              productId: [data.productId],
              inStock: [data.inStock],
              category: { categoryName: data.category.name , id: data.category.id},
              image1: null,
            };
            if (this.coverImagePreview) {
              this.coverImagePreview.nativeElement.src = data.imageUrl;
              console.log('Parent', this.coverImagePreview.nativeElement.src)
            }
            this.coverImage = data.coverImage
            this.image1 = data.imageUrl[0]
            console.log('Setting editImage', this.coverImage);
            
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
    const coverImage = formData.get('coverImage[0]');
    const category = formData.get('category[categoryName]');
    const image1 = formData.get('image1[0]');
    formData.delete('file[0]');
    formData.delete('coverImage[0]');
    formData.delete('category[categoryName]');
    formData.delete('image1[0]')
    formData.delete('category[id]');
    formData.set('file', image1!);
    formData.set('category', category!);
    formData.set('coverImage', coverImage!);
    formData.forEach((val: FormDataEntryValue, key: string) => {
      console.log(`After Val ${val} key ${key}`);
    });

    // this.adminService
    //   .addProduct(formData)
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe({
    //     next: (data) => {
    //       console.log('Received', data);
    //     },
    //     error: (err) => {
    //       console.log('err', err);
    //       this.store.dispatch(
    //         setLoadingSpinner({
    //           status: false,
    //           message: err.error?.detail || 'Please enter all the required data',
    //           isError: true,
    //         })
    //       );
    //     },
    //     complete: () => {
    //       this.store.dispatch(
    //         setLoadingSpinner({
    //           status: false,
    //           message: 'Added Product',
    //           isError: false,
    //         })
    //       );
    //       setTimeout(() => {
    //         this.router.navigateByUrl('/admin/products');
    //       }, 1500);
    //     },
    //   });
  }

  uploadDocument(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        this.coverImagePreview.nativeElement.src = '/assets/uploading.svg';
        console.log('Loading imagesss');
      };
      reader.onloadend = (event) => {
        console.log('image added');
        this.coverImagePreview.nativeElement.src = reader.result;
      };
    }
  }

  replaceImage(obj: {imgSrc: string, imageToChange: string}) {
    if (obj.imageToChange === 'coverImage') {
      this.replaceCoverImage(obj.imgSrc)
    }
    else if (obj.imageToChange === 'image1') {
      this.replaceImage1(obj.imgSrc)
    }
  }

  replaceCoverImage(imgSrc: string) {    
    this.coverImage = imgSrc
  }
  replaceImage1(imgSrc: string) {    
    this.image1 = imgSrc
  }
  removeImage(imageToRemove: string) {
    console.log("Removing image")
    if (imageToRemove === 'coverImage') {
      this.removeCoverImage()
    }
    else if (imageToRemove === 'image1') {

    }
  }
  removeCoverImage() {
    this.addProductForm.patchValue({ coverImage: null });
    this.coverImage = null
  }
  removeImage1() {
    this.addProductForm.patchValue({ file: null });
    this.image1 = null
  }

  deleteProduct(id: string) {
    scrollTo({ top: 0, behavior: 'smooth' });
    this.store.dispatch(deleteProduct({ id }));
  }

  get category() {
    return this.addProductForm.get('category')!;
  }

  get brandName() {
    return this.addProductForm.get('brandName')!;
  }
  
  get file() {
    return this.addProductForm.get('file')!;
  }
}
