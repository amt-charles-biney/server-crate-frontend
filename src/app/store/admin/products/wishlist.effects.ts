import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addToWishlist, getUserProducts, getWishlist, gotWishlist, removeFromWishlist } from "./categories.actions";
import { UserService } from "../../../core/services/user/user.service";
import { ToastrService } from "ngx-toastr";
import { EMPTY, catchError, map, switchMap, tap } from "rxjs";
import { errorHandler } from "../../../core/utils/helpers";
import { Store } from "@ngrx/store";

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
          switchMap(({ id, configOptions }) => {
            return this.userService.addToWishlist(id, configOptions).pipe(
              map(() => {
                this.toast.success('Added product to wishlist')
                this.store.dispatch(getUserProducts({ page: 0, params: {}}))
                return getWishlist()
              }),
              catchError((err) => {
                this.toast.error(errorHandler(err), 'Error')
                return EMPTY
              })
            )
          })
        )
      })
      
      removeFromWishlist$ = createEffect(() => {
        return this.action$.pipe(
          ofType(removeFromWishlist),
          switchMap(({ id }) => {
            return this.userService.removeFromWishlist(id).pipe(
              map(() => {
                this.toast.success('Removed product from wishlist')
                this.store.dispatch(getUserProducts({ page: 0, params: {}}))
                return getWishlist()
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
        private userService: UserService,
        private toast: ToastrService,
        private store: Store
      ) {}
}