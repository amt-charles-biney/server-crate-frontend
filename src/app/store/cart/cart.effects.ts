import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of } from "rxjs";
import { deleteCartItem, getCartItems, gotCartItems } from "./cart.actions";
import { ProductService } from "../../core/services/product/product.service";
import { setLoadingSpinner } from "../loader/actions/loader.actions";
import { errorHandler } from "../../core/utils/helpers";

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

    constructor(private action$: Actions, private productService: ProductService) {}
}