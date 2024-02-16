import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { AuthLoaderComponent } from '../../../../shared/components/auth-loader/auth-loader.component';
import {
  FormGroupExtension,
  RxFormBuilder,
  RxFormGroup,
  RxReactiveFormsModule,
  RxwebValidators,
} from '@rxweb/reactive-form-validators';
import { AttributeOption, BasicConfig, LoadingStatus, Select } from '../../../../types';
import { Observable, Subject } from 'rxjs';
import {
  deleteProduct,
  getCategories,
  getConfiguration,
} from '../../../../store/admin/products/categories.actions';
import { Store } from '@ngrx/store';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { selectConfigurationState } from '../../../../store/admin/products/configuration.reducers';
import { CustomImageComponent } from '../../../../shared/components/custom-image/custom-image.component';
import { Router } from '@angular/router';
import { setLoadingSpinner } from '../../../../store/loader/actions/loader.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { IncompatiblesComponent } from '../../../../shared/components/incompatibles/incompatibles.component';
import { selectLoaderState } from '../../../../store/loader/reducers/loader.reducers';
import { CURRENT_AD_TAB } from '../../../../core/utils/constants';

@Component({
  selector: 'app-case-management',
  standalone: true,
  imports: [
    CommonModule,
    CustomInputComponent,
    CustomImageComponent,
    AuthLoaderComponent,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    IncompatiblesComponent
  ],
  templateUrl: './case-management.component.html',
  styleUrl: './case-management.component.scss',
})
export class CaseManagementComponent implements OnInit {
  private option$ = new Subject<BasicConfig>();
  loadingState$!: Observable<LoadingStatus>;
  options = this.option$.asObservable();
  caseForm!: RxFormGroup;
  formGroup = {};
  id: string = '';
  coverImage: string | null = null;
  image1: string | null = null;
  image2: string | null = null;
  image3: string | null = null;

  incompatibleVariants: AttributeOption[] = []
  incompatibleAttributeOptions: string[] = []
  constructor(
    private fb: RxFormBuilder,
    private store: Store,
    private router: Router,
    private adminService: AdminService,
    private destroyRef: DestroyRef
  ) {}
  ngOnInit(): void {
    this.store.dispatch(getCategories());

    this.formGroup = {
      images: null,
      coverImage: null,
      name: [
        '',
        RxwebValidators.required({ message: 'Please enter a product name' }),
      ],
      description: [
        '',
        RxwebValidators.required({
          message: 'Please enter a product description',
        }),
      ],
      price: [
        '',
        RxwebValidators.required({ message: 'Please enter a price' }),
      ],
      image1: null,
      image2: null,
      image3: null,
      incompatibleVariants: null,
    };
    this.caseForm = <RxFormGroup>this.fb.group(this.formGroup);
    this.loadingState$ = this.store.select(selectLoaderState);
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
  cancel() {
    this.router.navigateByUrl('/admin/dashboard');
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
    this.caseForm.patchValue({ coverImage: null });
    this.coverImage = null;
  }
  removeImage1() {
    this.caseForm.patchValue({ image1: null });
    this.image1 = null;
  }
  removeImage2() {
    this.caseForm.patchValue({ image2: null });
    this.image2 = null;
  }
  removeImage3() {
    this.caseForm.patchValue({ image3: null });
    this.image3 = null;
  }

  deleteProduct(id: string) {
    scrollTo({ top: 0, behavior: 'smooth' });
    this.store.dispatch(deleteProduct({ id }));
  }

  getIncompatibleAttributeOptions({index, variants}: {index: number, variants: string[]}) {
    this.incompatibleAttributeOptions = variants
    console.log('Incompatibles', this.incompatibleAttributeOptions);
    
  }
  addCase() {
    if (this.caseForm.invalid) return;
    this.store.dispatch(
      setLoadingSpinner({
        status: true,
        message: '',
        isError: false,
      })
    );
    scrollTo({ top: 0, behavior: 'smooth' });
    const formData: FormData = (<FormGroupExtension>(
      this.caseForm
    )).toFormData();

    const coverImage = formData.get('coverImage[0]');
    const image1 = formData.get('image1[0]');
    const image2 = formData.get('image2[0]');
    const image3 = formData.get('image3[0]');
    
    formData.delete('coverImage[0]');
    formData.delete('image1[0]');
    formData.delete('image2[0]');
    formData.delete('image3[0]');
    formData.delete('images[0]');

    formData.set('coverImage', coverImage!);
    formData.append('images', image1!);
    formData.append('images', image2!);
    formData.append('images', image3!);

    this.incompatibleAttributeOptions.forEach((attributeOption) => {
      formData.append('incompatibleVariants', attributeOption)
    })

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
                message: 'Edited case successfully',
                isError: false,
              })
            );
            setTimeout(() => {
              this.router.navigateByUrl('/admin/dashboard');
            }, 1500);
          },
        });
    } else {
      this.adminService
        .addCase(formData)
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
              this.router.navigateByUrl('/admin/dashboard');
              sessionStorage.setItem(CURRENT_AD_TAB, 'Dashboard')

            }, 1500);
          },
        });
    }
  }
  get productName() {
    return this.caseForm.get('name')!;
  }
  get productDescription() {
    return this.caseForm.get('description')!;
  }
  get category() {
    return this.caseForm.get('category')!;
  }
}
