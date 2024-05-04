import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../../core/services/user/user.service';
import { filter } from './users.actions';
import { catchError, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { AllProducts, LoadingState } from '../../types';
import { gotProducts } from '../admin/products/categories.actions';
import { setLoadingSpinner } from '../loader/actions/loader.actions';
import { errorHandler } from '../../core/utils/helpers';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class UserEffect {
  filter$ = createEffect(() => {
    return this.action$.pipe(
      ofType(filter),
      switchMap((props) => {
        return this.userService.getProducts(props.page, props.params).pipe(
          map((products: AllProducts) => {
            return gotProducts({
              products: {
                content: products.content,
                size: products.size,
                totalElements: products.totalElements,
                totalPages: products.totalPages,
                product: products.content[0],
                callState: LoadingState.LOADED
              },
            });
          }),
          shareReplay(1),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error');
            return of();
          })
        );
      })
    );
  });

  constructor(
    private action$: Actions,
    private userService: UserService,
    private toast: ToastrService
  ) {}
}
