import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  deleteCategoriesAndConfig,
  getCategoriesAndConfig,
  getSingleCategoryAndConfig,
  gotCategoryAndConfig,
  gotCoverImage,
  gotSingleCategory,
  sendConfig,
  sendEditedConfig,
  uploadCoverImage,
} from './config.actions';
import { EMPTY, catchError, exhaustMap, finalize, map, of, switchMap } from 'rxjs';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { Store } from '@ngrx/store';
import {
  resetLoader,
  setLoadingSpinner,
} from '../../../loader/actions/loader.actions';
import { Router } from '@angular/router';
import { AllCategories, CategoryAndConfig } from '../../../../types';
import { errorHandler } from '../../../../core/utils/helpers';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { getNotifications } from '../../../admin/products/notifications.actions';

@Injectable()
export class ConfigEffect {
  sendConfig$ = createEffect(() => {
    return this.action$.pipe(
      ofType(sendConfig),
      switchMap((props) => {
        return this.adminService.createCategoryConfig(props).pipe(
          map(() => {
            this.toast.success("Category created successfully", "Success")
            this.router.navigateByUrl('/admin/categories');
            return resetLoader({ isError: false, message: '', status: false });
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), "Error")
            return EMPTY
          })
        );
      })
    );
  });

  getCategoriesAndConfig$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getCategoriesAndConfig),
      exhaustMap(({page}) => {
        return this.adminService.getCategoriesAndConfig(page).pipe(
          map((categories: AllCategories) => {
            return gotCategoryAndConfig(categories);
          }),
          catchError((err) => {
            return of(
              setLoadingSpinner({
                isError: true,
                message: errorHandler(err),
                status: false,
              })
            );
          })
        );
      })
    );
  });

  getSingleCategory$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getSingleCategoryAndConfig),
      switchMap((props) => {
        this.ngxService.startLoader('category')
        return this.adminService.getSingleCategory(props.id).pipe(
          map((props) => {
            this.store.dispatch(
              resetLoader({ isError: false, message: '', status: false })
            );
            return gotSingleCategory(props);
          }),
          catchError((err) => {
            return of(
              setLoadingSpinner({
                isError: true,
                message: errorHandler(err),
                status: false,
              })
            );
          }),
          finalize(() => {
            this.ngxService.stopLoader('category')
          })
        );
      })
    );
  });

  deleteCategories$ = createEffect(() => {
    return this.action$.pipe(
      ofType(deleteCategoriesAndConfig),
      exhaustMap((props) => {
        return this.adminService.deleteCategories(props.deleteList).pipe(
          map(() => {
            this.store.dispatch(getNotifications())
            return getCategoriesAndConfig({ page: 0});
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), "Error")
            return EMPTY
          })
        );
      })
    );
  });

  editConfig$ = createEffect(() => {
    return this.action$.pipe(
      ofType(sendEditedConfig),
      switchMap(({ configuration, id }) => {
        this.ngxService.startLoader('category')    
        return this.adminService.editCategory(id, configuration).pipe(
          map(() => {
            document.body.scrollTo({ top: 0, behavior: 'smooth'})
            
            this.router.navigateByUrl('/admin/categories');
            return getNotifications()
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), "Error")
            return EMPTY
          }),
          finalize(() => {
            this.ngxService.stopLoader('category')
          })
        );
      })
    );
  });

  uploadCategoryImage$ = createEffect(() => {
    return this.action$.pipe(
      ofType(uploadCoverImage),
      switchMap((props) => {
        this.toast.info('Uploading image to server', 'Upload')
        this.ngxService.startLoader('category')
        return this.adminService.uploadImage(props.form).pipe(
          map(({ url }) => {
            this.toast.success('Uploaded image successfully', 'Success')
            return gotCoverImage({ url });
          }),
          catchError((err) => {
            this.toast.error('Failed to upload image. Please try again', 'Error')
            return of();
          }),
          finalize(() => {
            this.ngxService.stopLoader('category')
          })
        )
      })
    )
  })

  constructor(
    private action$: Actions,
    private store: Store,
    private adminService: AdminService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private toast: ToastrService
  ) {}
}
