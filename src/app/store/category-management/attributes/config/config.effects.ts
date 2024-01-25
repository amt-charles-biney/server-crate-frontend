import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  deleteCategoriesAndConfig,
  getCategoriesAndConfig,
  getSingleCategoryAndConfig,
  gotCategoryAndConfig,
  sendConfig,
} from './config.actions';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { Store } from '@ngrx/store';
import {
  resetLoader,
  setLoadingSpinner,
} from '../../../loader/actions/loader.actions';
import { Router } from '@angular/router';
import { CategoryAndConfig } from '../../../../types';

@Injectable()
export class ConfigEffect {
  sendConfig$ = createEffect(
    () => {
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
              setTimeout(() => {
                this.router.navigateByUrl('/admin/category-management');
              }, 1500);
              return resetLoader({ isError: false, message: '', status: false })
            }),
            catchError((err) => {              
              return of(
                setLoadingSpinner({
                  isError: true,
                  message: err.error.detail,
                  status: false,
                })
              );
            })
          );
        })
      );
    },
  );

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
                message: err.error.detail,
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
          tap((data) => console.log('Data', data)
          )
        )
      })
    )
  }, { dispatch: false })

  deleteCategories$ = createEffect(() => {
    return this.action$.pipe(
      ofType(deleteCategoriesAndConfig),
      exhaustMap((props) => {
        return this.adminService.deleteCategories(props.deleteList).pipe(
          map(() => {
            setTimeout(() => {
              this.store.dispatch(resetLoader({isError: false, message: '', status: false }))
            }, 1500);
            return getCategoriesAndConfig();
          }),
          catchError((err) => {
            return of(
              setLoadingSpinner({
                isError: true,
                message: err.error.detail || 'Deleted',
                status: false,
              })
            );
          })
        );
      })
    );
  })

  constructor(
    private action$: Actions,
    private store: Store,
    private adminService: AdminService,
    private router: Router
  ) {}
}
