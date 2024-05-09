import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addToWishlist, getWishlist, gotWishlist, removeFromWishlist, updateUserProduct, wishlistUpdateFailure } from "../categories/categories.actions";
import { UserService } from "../../../../core/services/user/user.service";
import { EMPTY, catchError, concatMap, map, of, switchMap } from "rxjs";
import { errorHandler } from "../../../../core/utils/helpers";
import { Store } from "@ngrx/store";
import {MatSnackBar} from '@angular/material/snack-bar';
import { snackbarConfig } from "../../../../core/utils/constants";
import { SnackbarComponent } from "../../../../shared/components/snackbar/snackbar.component";

@Injectable()
export class WishlistEffect {
    getWishList$ = createEffect(() => {
        return this.action$.pipe(
          ofType(getWishlist),
          switchMap(() => {
            return this.userService.getWishlist().pipe(
              map(({ content, size, totalElements, totalPages}) => {
                return gotWishlist({ content, size, totalElements, totalPages })
              }),
              catchError((err) => {
                this.snackbar.openFromComponent(SnackbarComponent, {
                  data: {
                    message: errorHandler(err),
                  },
                  panelClass: 'red-snackbar',
                  ...snackbarConfig
                })
                return EMPTY
              })
            )
          })
        )
      })
    
      addToWishlist$ = createEffect(() => {
        return this.action$.pipe(
          ofType(addToWishlist),
          switchMap(({ id, configOptions }) => {
            return this.userService.addToWishlist(id, configOptions).pipe(
              map(() => {
                this.store.dispatch(updateUserProduct({ id }))
                return getWishlist()
              }), 
              catchError((err) => {
                this.snackbar.openFromComponent(SnackbarComponent, {
                  data: {
                    message: errorHandler(err),
                  },
                  panelClass: 'red-snackbar',
                  ...snackbarConfig
                })
                return of(wishlistUpdateFailure({ id }))
              })
            )
          })
        )
      })
      
      removeFromWishlist$ = createEffect(() => {
        return this.action$.pipe(
          ofType(removeFromWishlist),
          concatMap(({ id }) => {
            return this.userService.removeFromWishlist(id).pipe(
              map(() => {
                this.store.dispatch(updateUserProduct({ id }))
                return getWishlist()
              }),
              catchError((err) => {
                this.snackbar.openFromComponent(SnackbarComponent, {
                  data: {
                    message: errorHandler(err),
                  },
                  panelClass: 'red-snackbar',
                  ...snackbarConfig
                })
                return of(wishlistUpdateFailure({ id }))
              })
            )
          })
        )
      })

      constructor(
        private action$: Actions,
        private userService: UserService,
        private store: Store,
        private snackbar: MatSnackBar
      ) {}
}