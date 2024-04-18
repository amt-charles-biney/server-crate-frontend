import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addBrand,
  addProduct,
  categoryFailure,
  deleteBrand,
  deleteProduct,
  getBrands,
  getCases,
  getCategories,
  getConfiguration,
  getProduct,
  getProducts,
  getUserBrands,
  getUserCategories,
  gotBrands,
  gotCases,
  gotCategories,
  gotConfiguration,
  gotProduct,
  updateProduct,
} from './categories.actions';
import {
  EMPTY,
  catchError,
  concatMap,
  exhaustMap,
  finalize,
  map,
  of,
  tap,
  throwError,
  timeout,
} from 'rxjs';
import { AdminService } from '../../../core/services/admin/admin.service';
import { Select, Item, ProductItem, PageAbleResponseData } from '../../../types';
import { Store } from '@ngrx/store';
import {
  resetLoader,
  setLoadingSpinner,
} from '../../loader/actions/loader.actions';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user/user.service';
import { errorHandler } from '../../../core/utils/helpers';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { getNotifications } from './notifications.actions';

@Injectable()
export class CategoryEffect {
  getCategory$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getCategories),
      exhaustMap(() => {
        return this.adminService.getCategories().pipe(
          map((data: Select[]) => {
            this.store.dispatch(
              setLoadingSpinner({
                status: false,
                message: '',
                isError: false,
              })
            );

            return gotCategories({ categories: data });
          }),
          timeout(8000),
          catchError((err) => {
            throwError(() => 'Request timed out');
            this.store.dispatch(
              setLoadingSpinner({
                status: false,
                message:
                  err.error.detail || 'Cannot fetch categories from server',
                isError: true,
              })
            );
            return of(categoryFailure());
          })
        );
      })
    );
  });
  getUserCategories$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getUserCategories),
      exhaustMap(() => {
        return this.userService.getCategories().pipe(
          map((data: Select[]) => {
            this.store.dispatch(
              setLoadingSpinner({
                status: false,
                message: '',
                isError: false,
              })
            );

            return gotCategories({ categories: data });
          }),
          timeout(8000),
          catchError((err) => {
            throwError(() => 'Request timed out');
            this.store.dispatch(
              setLoadingSpinner({
                status: false,
                message: errorHandler(err),
                isError: true,
              })
            );
            return of(categoryFailure());
          })
        );
      })
    );
  });
  getBrands$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getBrands),
      exhaustMap(() => {
        return this.adminService.getBrands().pipe(
          map((data: Select[]) => {
            return gotBrands({ brands: data });
          }),
          catchError((err) => {
            return of(categoryFailure());
          })
        );
      })
    );
  });
  getUserBrands$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getUserBrands),
      exhaustMap(() => {
        return this.userService.getBrands().pipe(
          map((data: Select[]) => {
            this.store.dispatch(
              setLoadingSpinner({
                status: false,
                message: '',
                isError: false,
              })
            );
            return gotBrands({ brands: data });
          }),
          timeout(5000),
          catchError((err) => {
            throwError(() => 'Request timed out');
            return of(categoryFailure());
          })
        );
      })
    );
  });

  getCategoryConfig$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getConfiguration),
      concatMap((selectedCategory: Select) => {
        this.ngxService.startBackgroundLoader('getConfig');
        return this.adminService
          .getCategoryConfiguration(selectedCategory.id)
          .pipe(
            map((data) => {
              return gotConfiguration(data);
            }),
            catchError((error) => {
              this.toast.error(errorHandler(error), "Error")
              return EMPTY
            }),
            finalize(() => {
              this.ngxService.stopBackgroundLoader('getConfig');
            })
          );
      })
    );
  });

  getProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getProduct),
      exhaustMap((prop: Item) => {
        this.ngxService.startLoader('product');
        return this.adminService.getProduct(prop.id).pipe(
          map((data: ProductItem) => {
            return gotProduct(data);
          }),
          catchError((error) => {
            this.toast.error(errorHandler(error), "Error")
            return EMPTY
          }),
          finalize(() => {
            this.ngxService.stopLoader('product');
          })
        );
      })
    );
  });
  deleteProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(deleteProduct),
      exhaustMap((props) => {
        this.ngxService.startLoader('product');
        return this.adminService.deleteProduct(props.id).pipe(
          map(() => {
              this.router.navigateByUrl('/admin/products', {
                replaceUrl: true,
              });
            return getProducts({ page: 0 });
          }),
          timeout(5000),
          catchError((err) => {
            throwError(() => 'Request timed out');
            return of(
              setLoadingSpinner({
                isError: true,
                message:
                  err.error.detail || 'Cannot delete non existent product',
                status: false,
              })
            );
          }),
          finalize(() => {
            this.ngxService.stopLoader('product');
          })
        );
      })
    );
  });

  addProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addProduct),
      exhaustMap((product) => {
        this.ngxService.startLoader('product');
        return this.adminService.addProduct(product).pipe(
          map(() => {
            this.toast.success('Added product successfully', 'Success')
          }),
          tap(() => {
            this.ngxService.stopLoader('product');
              this.router.navigateByUrl('/admin/products', {
                replaceUrl: true,
              });
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return of();
          }),
          finalize(() => {
            this.ngxService.stopLoader('product');
          })
        );
      })
    );
  }, { dispatch: false });
  updateProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updateProduct),
      exhaustMap((props) => {
        this.ngxService.startLoader('product');
        return this.adminService.updateProduct(props.id, props.product).pipe(
          map(() => {
            this.toast.success('Edited product successfully', 'Success', {
              timeOut: 1000
            })
            this.ngxService.stopLoader('product');
              this.router.navigateByUrl('/admin/products', {
                replaceUrl: true,
              });
            return getNotifications()
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return EMPTY
          })
        );
      })
    );
  });

  getCases$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getCases),
      exhaustMap(() => {
        return this.userService.getCases().pipe(
          map(( response: PageAbleResponseData<Select> ) => {
            return gotCases({ cases: response.content })
          })
        )
      })
    )
  })
  constructor(
    private action$: Actions,
    private adminService: AdminService,
    private userService: UserService,
    private store: Store,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private toast: ToastrService
  ) {}
}
