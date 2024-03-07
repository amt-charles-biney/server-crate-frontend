import { AdminService } from './../../../core/services/admin/admin.service';
import {
  addToFeature,
  getProducts,
  getUserProducts,
  gotProducts,
  removeFromFeature,
} from './categories.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, shareReplay, switchMap } from 'rxjs';
import { AllProducts, ProductItem } from '../../../types';
import { UserService } from '../../../core/services/user/user.service';
import { setLoadingSpinner } from '../../loader/actions/loader.actions';
import { errorHandler } from '../../../core/utils/helpers';

@Injectable()
export class ProductsEffect {
  loadProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getProducts),
      exhaustMap((props) => {
        return this.adminService.getProducts(props.page).pipe(
          map((products: AllProducts) => {
            return gotProducts({ products });
          }),
          shareReplay(1),
          catchError((err) => {
            return of(setLoadingSpinner({
              isError: true,
              message: errorHandler(err),
              status: false
            }));
          })
        );
      })
    );
  });
  loadUserProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getUserProducts),
      exhaustMap((props) => {
        return this.userService.getProducts(props.page, props.params).pipe(
          map((products: AllProducts) => {
            return gotProducts({ products });
          }),
          shareReplay(1),
          catchError((err) => {
            return of(setLoadingSpinner({
              isError: true,
              message: errorHandler(err),
              status: false
            }));
          })
        );
      })
    );
  });

  addFeatured$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addToFeature),
      switchMap(({ id }) => {
        return this.adminService.addToFeature(id).pipe(
          catchError((err) => {
            return of(setLoadingSpinner({
              isError: true,
              message: errorHandler(err),
              status: false
            }));
          })
        )
      })
    )
  }, { dispatch: false})
  removeFeatured$ = createEffect(() => {
    return this.action$.pipe(
      ofType(removeFromFeature),
      switchMap(({ id }) => {
        return this.adminService.removeFromFeature(id).pipe(
          catchError((err) => {
            return of(setLoadingSpinner({
              isError: true,
              message: errorHandler(err),
              status: false
            }));
          })
        )
      })
    )
  }, { dispatch: false})



  constructor(
    private action$: Actions,
    private adminService: AdminService,
    private userService: UserService
  ) {}
}
