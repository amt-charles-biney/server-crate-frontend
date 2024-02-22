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
import { catchError, exhaustMap, finalize, map, of, switchMap } from 'rxjs';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { Store } from '@ngrx/store';
import {
  resetLoader,
  setLoadingSpinner,
} from '../../../loader/actions/loader.actions';
import { Router } from '@angular/router';
import { CategoryAndConfig } from '../../../../types';
import { errorHandler } from '../../../../core/utils/helpers';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class ConfigEffect {
  sendConfig$ = createEffect(() => {
    return this.action$.pipe(
      ofType(sendConfig),
      switchMap((props) => {
        return this.adminService.createCategoryConfig(props).pipe(
          map(() => {
            this.store.dispatch(
              setLoadingSpinner({
                isError: false,
                message: 'Created new category',
                status: false,
              })
            );
            this.router.navigateByUrl('/admin/category-management');
            return resetLoader({ isError: false, message: '', status: false });
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

  getCategoriesAndConfig$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getCategoriesAndConfig),
      exhaustMap(() => {
        return this.adminService.getCategoriesAndConfig().pipe(
          map((categories: CategoryAndConfig[]) => {
            return gotCategoryAndConfig({ categories });
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
            setTimeout(() => {
              this.store.dispatch(
                resetLoader({ isError: false, message: '', status: false })
              );
            }, 1500);
            return getCategoriesAndConfig();
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

  editConfig$ = createEffect(() => {
    return this.action$.pipe(
      ofType(sendEditedConfig),
      switchMap(({ configuration, id }) => {
        this.ngxService.startLoader('category')    
        return this.adminService.editCategory(id, configuration).pipe(
          map(() => {
            setTimeout(() => {
              this.router.navigateByUrl('/admin/category-management');
            }, 500);
            return resetLoader({ isError: false, message: '', status: false });
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

  uploadCategoryImage$ = createEffect(() => {
    return this.action$.pipe(
      ofType(uploadCoverImage),
      switchMap((props) => {
        this.ngxService.startLoader('category')
        return this.adminService.uploadImage(props.form).pipe(
          map(({ url }) => {
            this.store.dispatch(
              setLoadingSpinner({
                isError: false,
                message: 'Picture uploaded',
                status: false,
              })
            );
            
            return gotCoverImage({ url });
          }),
          catchError((err) => {
            return of(
              setLoadingSpinner({
                isError: true,
                message: err.error.detail,
                status: false,
              })
            );
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
    private ngxService: NgxUiLoaderService
  ) {}
}
