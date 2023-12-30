import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addProduct,
  categoryFailure,
  deleteProduct,
  getCategories,
  getConfiguration,
  getProduct,
  getProducts,
  gotCategories,
  gotConfiguration,
  gotProduct,
} from './categories.actions';
import { catchError, exhaustMap, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { AdminService } from '../../../core/services/admin/admin.service';
import { Category, Item, ProductItem } from '../../../types';
import { Store } from '@ngrx/store';
import { setLoadingSpinner } from '../../loader/actions/loader.actions';

@Injectable()
export class CategoryEffect {
  getCategory$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getCategories),
      tap((x) => console.log('Fetch categories', x)),
      exhaustMap(() => {
        return this.adminService.getCategories().pipe(
          map((data: Category[]) => {
            console.log('Fetching categories');
            this.store.dispatch(
              setLoadingSpinner({
                status: false,
                message: '',
                isError: false,
              })
            );
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

  gotCategory$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getConfiguration),
      switchMap((selectedCategory: Category) => {
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
            })
          );
      })
    );
  });

  addProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addProduct),
      exhaustMap((formData: FormData) => {
        // console.log(
        //     formData.get('productId')
        //   );
        return this.adminService.addProduct(formData).pipe(
          map((data) => {
            console.log('Added products', data);

            return getProducts;
          }),
          catchError((err) => {
            console.log('Error occured', err);
            return of(categoryFailure());
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
            return gotProduct(data)
          })
        )
      })
    )
  })
  // deleteProduct$ = createEffect(() => {
  //   return this.action$.pipe(
  //     ofType(deleteProduct),
  //     exhaustMap((props) => {
  //       return this.adminService.deleteProduct(props.id).pipe(
  //         map(())
  //       )
  //     })
  //   )
  // })

  constructor(
    private action$: Actions,
    private adminService: AdminService,
    private store: Store
  ) {}
}
