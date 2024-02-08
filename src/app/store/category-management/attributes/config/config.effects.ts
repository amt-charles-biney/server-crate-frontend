import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  deleteCategoriesAndConfig,
  getCategoriesAndConfig,
  getSingleCategoryAndConfig,
  gotCategoryAndConfig,
  gotSingleCategory,
  sendConfig,
  sendEditedConfig,
} from './config.actions';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { Store } from '@ngrx/store';
import {
  resetLoader,
  setLoadingSpinner,
} from '../../../loader/actions/loader.actions';
import { Router } from '@angular/router';
import { CategoryAndConfig } from '../../../../types';
import { errorHandler } from '../../../../core/utils/helpers';

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
        return this.adminService.editCategory(id, configuration).pipe(
          map(() => {
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

  constructor(
    private action$: Actions,
    private store: Store,
    private adminService: AdminService,
    private router: Router
  ) {}
}
