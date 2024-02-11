import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addBrand,
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
} from './categories.actions';
import {
  catchError,
  concatMap,
  exhaustMap,
  map,
  of,
  tap,
  throwError,
  timeout,
} from 'rxjs';
import { AdminService } from '../../../core/services/admin/admin.service';
import { Select, Item, ProductItem } from '../../../types';
import { Store } from '@ngrx/store';
import { setLoadingSpinner } from '../../loader/actions/loader.actions';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user/user.service';

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
        return this.adminService
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
        return this.adminService.getProduct(prop.id).pipe(
          map((data: ProductItem) => {
            return gotProduct(data);
          }),
          catchError((error) => {
            console.log('Doesnt exist');
            return of();
          })
        );
      })
    );
  });
  deleteProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(deleteProduct),
      exhaustMap((props) => {
        return this.adminService.deleteProduct(props.id).pipe(
          map(() => {
            setTimeout(() => {
              this.router.navigateByUrl('/admin/products', {
                replaceUrl: true,
              });
            }, 1500);
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
          })
        );
      })
    );
  });

  addBrand$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addBrand),
      exhaustMap(({ name }) => {
        return this.adminService.addBrand(name).pipe(
          map(() => {
            setTimeout(() => {
              this.store.dispatch(getBrands())
            }, 2000);
            return setLoadingSpinner({
                status: false,
                message: 'Added brand name successfully',
                isError: false,
              })
          }),
          timeout(5000),
          catchError((err) => {
            throwError(() => 'Request timed out');
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

  deleteBrand$ = createEffect(() => {
    return this.action$.pipe(
      ofType(deleteBrand),
      exhaustMap(({ id }) => {
        return this.adminService.deleteBrand(id).pipe(
          map(() => {
            setTimeout(() => {
              this.store.dispatch(getBrands())
            }, 2000);
            return setLoadingSpinner({
                status: false,
                message: 'Deleted brand name successfully',
                isError: false,
              })
          }),
          timeout(5000),
          catchError((err) => {
            throwError(() => 'Request timed out');
            return of(
              setLoadingSpinner({
                isError: true,
                message: err.error.detail,
                status: false,
              })
            );
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
    private router: Router
  ) {}
}
