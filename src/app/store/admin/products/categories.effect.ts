import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addBrand,
  addProduct,
  categoryFailure,
  deleteBrand,
  deleteProduct,
  getBrands,
  getCategories,
  getConfiguration,
  getProduct,
  getProducts,
  getUserBrands,
  getUserCategories,
  getUserConfiguration,
  gotBrands,
  gotCategories,
  gotConfiguration,
  gotProduct,
  updateProduct,
} from './categories.actions';
import {
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
import { Select, Item, ProductItem } from '../../../types';
import { Store } from '@ngrx/store';
import { resetLoader, setLoadingSpinner } from '../../loader/actions/loader.actions';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user/user.service';
import { errorHandler } from '../../../core/utils/helpers';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class CategoryEffect {
  getCategory$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getCategories),
      tap((x) => console.log('Fetch categories', x)),
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
            console.log('categories', data);
            return gotCategories({ categories: data });
          }),
          timeout(8000),
          catchError((err) => {
            throwError(() => 'Request timed out');
            console.log('Error occured', err);
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
      tap((x) => console.log('Fetch categories', x)),
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
            console.log('categories', data);
            return gotCategories({ categories: data });
          }),
          timeout(8000),
          catchError((err) => {
            throwError(() => 'Request timed out');
            console.log('Error occured', err);
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
  getBrands$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getBrands),
      tap((x) => console.log('Fetch categories', x)),
      exhaustMap(() => {
        return this.adminService.getBrands().pipe(
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
            console.log('Error occured', err);
            return of(categoryFailure());
          })
        );
      })
    );
  });
  getUserBrands$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getUserBrands),
      tap((x) => console.log('Fetch categories', x)),
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
            console.log('Error occured', err);
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
        this.ngxService.startBackgroundLoader('getConfig')
        return this.adminService
          .getCategoryConfiguration(selectedCategory.id)
          .pipe(
            map((data) => {
              return gotConfiguration(data);
            }),
            timeout(5000),
            catchError((error) => {
              throwError(() => 'Request timed out');
              return of(
                setLoadingSpinner({
                  status: false,
                  message:
                  error.error.detail || 'Cannot get category configuration',
                  isError: true,
                })
              );
            }),
            finalize(() => {
              this.ngxService.stopBackgroundLoader('getConfig')
            })
          );
      })
    );
  });
  
  getUserCategoryConfig$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getUserConfiguration),
      concatMap((selectedCategory: Select) => {
        return this.userService
          .getCategoryConfiguration(selectedCategory.id)
          .pipe(
            map((data) => {
              this.store.dispatch(
                setLoadingSpinner({
                  status: false,
                  message: '',
                  isError: false,
                })
              );
              return gotConfiguration(data);
            }),
            timeout(5000),
            catchError((error) => {
              throwError(() => 'Request timed out');
              return of(
                setLoadingSpinner({
                  status: false,
                  message:
                  error.error.detail || 'Cannot get category configuration',
                  isError: true,
                })
              );
            })
          );
      })
    );
  });


  getProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getProduct),
      exhaustMap((prop: Item) => {
        this.ngxService.startLoader('product')
        return this.adminService.getProduct(prop.id).pipe(
          map((data: ProductItem) => {
            return gotProduct(data);
          }),
          catchError((error) => {
            console.log('Doesnt exist');
            return of(setLoadingSpinner({
              isError: true,
              message: errorHandler(error),
              status: false
            }));
          }),
          finalize(() => {
            this.ngxService.stopLoader('product')
          })
        );
      })
    );
  });
  deleteProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(deleteProduct),
      exhaustMap((props) => {
        this.ngxService.startLoader('product')
        return this.adminService.deleteProduct(props.id).pipe(
          map(() => {
            setTimeout(() => {
              
            }, 0);
            return getProducts({ page: 0 });
          }),
          tap(() => {
            this.ngxService.stopLoader('product')
            setTimeout(() => {
              this.router.navigateByUrl('/admin/products', {
                replaceUrl: true,
              });
            }, 500);
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
            
          })
        );
      })
    );
  });

  addProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addProduct),
      exhaustMap((product) => {
        this.ngxService.startLoader('product')
        return this.adminService.addProduct(product).pipe(
          map(() => {
            return setLoadingSpinner({
              isError: false,
              message: 'Added product successfully',
              status: false
            })
          }),
          tap(() => {
            this.ngxService.stopLoader('product')
            setTimeout(() => {
              this.router.navigateByUrl('/admin/products', {
                replaceUrl: true,
              });
            }, 500);
          }),
          catchError((err) => {
            return of(setLoadingSpinner({
              isError: true,
              message: errorHandler(err),
              status: false
            }))
          }),
          finalize(() => {
            this.ngxService.stopLoader('product')
          })
        )
      })
    )
  })
  updateProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updateProduct),
      exhaustMap((props) => {
        this.ngxService.startLoader('product')
        return this.adminService.updateProduct(props.id, props.product).pipe(
          map(() => {
            return setLoadingSpinner({
              isError: false,
              message: 'Edited product successfully',
              status: false
            })
          }),
          tap(() => {
            this.ngxService.stopLoader('product')
            setTimeout(() => {
              this.router.navigateByUrl('/admin/products', {
                replaceUrl: true,
              });
            }, 500);
          }),
          catchError((err) => {
            return of(setLoadingSpinner({
              isError: true,
              message: errorHandler(err),
              status: false
            }))
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
    private ngxService: NgxUiLoaderService
  ) {}
}
