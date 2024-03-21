import { AdminService } from './../../../core/services/admin/admin.service';
import {
  addToFeature,
  addToWishlist,
  getProducts,
  getRecommendations,
  getUserProducts,
  getWishlist,
  gotProducts,
  gotRecommendations,
  gotWishlist,
  removeFromFeature,
} from './categories.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, catchError, exhaustMap, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { AllProducts } from '../../../types';
import { UserService } from '../../../core/services/user/user.service';
import { setLoadingSpinner } from '../../loader/actions/loader.actions';
import { errorHandler } from '../../../core/utils/helpers';
import { ToastrService } from 'ngx-toastr';

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

  getRecommendations$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getRecommendations),
      switchMap(() => {
        return this.userService.getRecommendations().pipe(
          map((recommendations) => {
            return gotRecommendations({recommendations})
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return EMPTY
          })
        )
      })
    )
  })

  getWishList$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getWishlist),
      switchMap(() => {
        return this.userService.getWishlist().pipe(
          map(({ content, size, totalElements, totalPages}) => {
            return gotWishlist({ content, size, totalElements, totalPages })
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return EMPTY
          })
        )
      })
    )
  })

  addToWishlist$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addToWishlist),
      switchMap(({ id }) => {
        return this.userService.addToWishlist(id).pipe(
          tap(() => {
            this.toast.success('Added product to wishlist', 'Success', { timeOut: 1000 })
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return EMPTY
          })
        )
      })
    )
  }, { dispatch: false })


  constructor(
    private action$: Actions,
    private adminService: AdminService,
    private userService: UserService,
    private toast: ToastrService
  ) {}
}
