import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, finalize, map, of, switchMap } from "rxjs";
import { decreaseQuantity, deleteCartItem, getCartItems, gotCartItems, increaseQuantity } from "./cart.actions";
import { ProductService } from "../../core/services/product/product.service";
import { setLoadingSpinner } from "../loader/actions/loader.actions";
import { errorHandler, resetLoaderFn } from "../../core/utils/helpers";
import { CartQuantity } from "../../types";

@Injectable()
export class CartEffects {
    gotCartItems$ = createEffect(() => {
        return this.action$.pipe(
            ofType(getCartItems),
            exhaustMap(() => {
                return this.productService.getCartItems().pipe(
                    map(({ configuredProducts, count }) => {
                        return gotCartItems({ configuredProducts, count })
                    }),
                    catchError((err) => {
                        return of()
                    }),
                )
            })
        )
    })

    deleteCartItem$ = createEffect(() => {
        return this.action$.pipe(
            ofType(deleteCartItem),
            exhaustMap(({ id }) => {
                return this.productService.deleteCartItem(id).pipe(
                    map(() => {
                        return getCartItems()
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

    increaseQuantity$ = createEffect(() => {
        return this.action$.pipe(
            ofType(increaseQuantity),
            switchMap((props: CartQuantity) => {
                return this.productService.changeQuantity(props).pipe(

                )
            })
        )
    }, { dispatch: false })
    decreaseQuantity$ = createEffect(() => {
        return this.action$.pipe(
            ofType(decreaseQuantity),
            switchMap((props: CartQuantity) => {
                return this.productService.changeQuantity(props).pipe(

                )
            })
        )
    }, { dispatch: false })

    constructor(private action$: Actions, private productService: ProductService) {}
}