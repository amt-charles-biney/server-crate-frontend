import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addToWishlist, getWishlist, gotWishlist } from "./categories.actions";
import { UserService } from "../../../core/services/user/user.service";
import { ToastrService } from "ngx-toastr";
import { EMPTY, catchError, map, switchMap, tap } from "rxjs";
import { errorHandler } from "../../../core/utils/helpers";

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
          switchMap(({ id }) => {
            return this.userService.addToWishlist(id).pipe(
              map(() => {
                this.toast.success('Added product to wishlist', 'Success', { timeOut: 1000 })
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
        private toast: ToastrService
      ) {}
}