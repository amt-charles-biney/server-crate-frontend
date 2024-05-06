import { AdminService } from './../../../core/services/admin/admin.service';
import {
  addToFeature,
  getAllProducts,
  getProducts,
  getRecommendations,
  getSingleProduct,
  getUserProducts,
  gotAllProducts,
  gotProducts,
  gotProductsFailure,
  gotRecommendations,
  gotSingleProduct,
  removeFromFeature,
} from './categories/categories.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { AllProducts } from '../../../types';
import { UserService } from '../../../core/services/user/user.service';
import { setLoadingSpinner } from '../../loader/actions/loader.actions';
import { errorHandler } from '../../../core/utils/helpers';
import { ToastrService } from 'ngx-toastr';

const cache = new Map()
@Injectable()
export class ProductsEffect {
  loadProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getProducts),
      exhaustMap((props) => {
        
        return this.adminService.getProducts(props.page).pipe(
          map((products: AllProducts) => {
            sessionStorage.setItem("search", JSON.stringify(""))
            return gotProducts({ products });
          }),
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

  getAllProducts$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getAllProducts),
      exhaustMap(() => {
        return this.userService.getAllProducts().pipe(
          map((products) => {
            return gotAllProducts({ products: products.data })
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), "Error")
            return EMPTY
          })
        )
      })
    )
  })

  getSingleProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getSingleProduct),
      exhaustMap(({ id }) => {
        return this.userService.getSingleProduct(id).pipe(
          map((product) => {
            return gotSingleProduct(product.data)
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), "Error")
            return EMPTY
          })
        )
      })
    )
  })

  loadUserProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getUserProducts),
      exhaustMap((props) => {
        return this.userService.getProducts(props.page, props.params).pipe(
          map((products: AllProducts) => {
            return gotProducts({ products });
          }),
          catchError((err) => {
            return of(gotProductsFailure({ errorMessage: errorHandler(err) }))
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


  constructor(
    private action$: Actions,
    private adminService: AdminService,
    private userService: UserService,
    private toast: ToastrService,
  ) {}
}
