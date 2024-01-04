import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addProduct,
  categoryFailure,
  deleteProduct,
  getBrands,
  getCategories,
  getConfiguration,
  getProduct,
  getProducts,
  gotBrands,
  gotCategories,
  gotConfiguration,
  gotProduct,
} from './categories.actions';
import {
  catchError,
  exhaustMap,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
  timeout,
} from 'rxjs';
import { AdminService } from '../../../core/services/admin/admin.service';
import { Select, Item, ProductItem, Category } from '../../../types';
import { Store } from '@ngrx/store';
import { setLoadingSpinner } from '../../loader/actions/loader.actions';
import { Router } from '@angular/router';

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
            console.log('categories', data)
            return gotCategories({ categories: data });
          }),
          catchError((err) => {
            console.log('Error occured', err);
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
          catchError((err) => {
            console.log('Error occured', err);
            return of(categoryFailure());
          })
        );
      })
    );
  });

  gotCategory$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getConfiguration),
      switchMap((selectedCategory: Select) => {
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
              console.log('data from config', data);
              return gotConfiguration(data);
            }),
            catchError(error => {
              return of(setLoadingSpinner({
                status: false,
                message: error.error.detail,
                isError: true,
              }))
            })
          );
      }),
    );
  });

  // transformToSelect(obj: Category): any {
  //   // Perform key renaming logic here
  //   const newObj:any = { ...obj }; // Create a new object to avoid mutating the original
  //   if (newObj.categoryName) {
  //     newObj.name = newObj.categoryName;
  //     delete newObj.categoryName;
  //   }
  //   return newObj;
  // }

  // addProduct$ = createEffect(() => {
  //   return this.action$.pipe(
  //     ofType(addProduct),
  //     exhaustMap((formData: FormData) => {
  //       // console.log(
  //       //     formData.get('productId')
  //       //   );
  //       return this.adminService.addProduct(formData).pipe(
  //         map((data) => {
  //           console.log('Added products', data);

  //           return getProducts;
  //         }),
  //         catchError((err) => {
  //           console.log('Error occured', err);
  //           return of(categoryFailure());
  //         })
  //       );
  //     })
  //   );
  // });

  getProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getProduct),
      exhaustMap((prop: Item) => {
        return this.adminService.getProduct(prop.id).pipe(
          map((data: ProductItem) => {
            return gotProduct(data);
          }),
          catchError(error => {
            console.log('Doesnt exist')
            return of()
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
              this.router.navigateByUrl('/admin/products', { replaceUrl: true })
            }, 1500);
            return getProducts({page: 0});
          }),
          timeout(5000),
          catchError((err) => {
            throwError(() => 'Request timed out')
            return of(
              setLoadingSpinner({
                isError: true,
                message: err.error.detail || 'Cannot delete non existent product',
                status: false,
              })
            );
          })
        );
      }),      
    );
  });

  constructor(
    private action$: Actions,
    private adminService: AdminService,
    private store: Store,
    private router: Router
  ) {}
}
