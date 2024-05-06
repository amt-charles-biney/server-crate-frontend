import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addToWishlist, getUserProducts, getWishlist, gotWishlist, removeFromWishlist, updateUserProduct, wishlistUpdateFailure } from "../categories/categories.actions";
import { UserService } from "../../../../core/services/user/user.service";
import { ToastrService } from "ngx-toastr";
import { EMPTY, catchError, concatMap, exhaustMap, map, of, switchMap, tap } from "rxjs";
import { errorHandler } from "../../../../core/utils/helpers";
import { Store } from "@ngrx/store";
import { loadFeaturedProducts } from "../../../product/featured-product/featured-product.action";

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
                this.store.dispatch(updateUserProduct({ id }))
                this.store.dispatch(getWishlist());
                return loadFeaturedProducts()
              }),
              catchError((err) => {
                this.toast.error(errorHandler(err), 'Error')
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
                this.store.dispatch(getWishlist());
                return loadFeaturedProducts()
              }),
              catchError((err) => {
                this.toast.error(errorHandler(err), 'Error')
                return of(wishlistUpdateFailure({ id }))
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