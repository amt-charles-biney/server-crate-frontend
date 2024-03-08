import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, mergeMap, of, tap } from "rxjs";
import { map, exhaustMap, catchError } from "rxjs";
import { ProductService } from "../../core/services/product/product.service";
import { addToCartItem, addToCartItemFailure, addToCartItemSuccess, loadProduct, loadProductConfig, loadProductConfigFailure, loadProductConfigItem, loadProductConfigItemFailure, loadProductConfigItemSuccess, loadProductConfigSuccess, loadProductFailure, loadProductSuccess } from "./product-spec.action";
import { ICategoryConfig, IConfiguredProduct, IParamConfigOptions, ProductItem } from "../../types";
import { getCartItems } from "../cart/cart.actions";
import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class ProductSpecEffects {

  loadProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(loadProduct),
      exhaustMap((props: { id: string}) => {
        return this.productService.getProduct(props.id).pipe(
          map((product: ProductItem) => {
            return loadProductSuccess({ product })}),
          catchError((error: any) => {
            const getError: string = error["error"]["detail"] ?? "failed"
           return of(loadProductFailure({ error: getError }))
          })
        )
      })
    )
  })

  loadProductSuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(loadProductSuccess),
      map(action => loadProductConfig({ categoryId: action.product.id }))
    )
  })

  loadProductConfig$ = createEffect(() => {
    return this.action$.pipe(
      ofType(loadProductConfig),
      exhaustMap((props: { categoryId: string }) => {
        return this.productService.getProductConfiguration(props.categoryId).pipe(
          map((productConfig: ICategoryConfig) => {
            return loadProductConfigSuccess({ productConfig })
          }),
          catchError((error: any) => {
            const getError: string = error["error"]["detail"] ?? "failed"
            return of(loadProductConfigFailure({ error: getError }))
          })
        )
      })
    )
  })


  loadProductConfigItem$ = createEffect(() => {
    return this.action$.pipe(
      ofType(loadProductConfigItem),
      exhaustMap((props: { productId: string, configOptions: IParamConfigOptions}) => {
        return this.productService.getProductConfigItem(props.productId, props.configOptions)
        .pipe(
          map((productConfigItem: IConfiguredProduct) => {
            return loadProductConfigItemSuccess({ productConfigItem })
          }),
          catchError((error: any) => {
            const getError: string = error["error"]["detail"] ?? "failed"
            return of(loadProductConfigItemFailure({ error: getError }))
          })
        )
      })
    )
  })

  loadProductCartItem$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addToCartItem),
      exhaustMap((props: { productId: string, configOptions: IParamConfigOptions }) => {
        return this.productService.addProductToCart(props.productId, props.configOptions)
        .pipe(
          map((props: { message: string, configuration: IConfiguredProduct}) => {
            this.toast.success(props.message, 'Success')
            this.store.dispatch(getCartItems())
            return addToCartItemSuccess({ message: props.message, configuration: props.configuration })
          }),
          catchError((error: any) => {
            const getError: string = error["error"]["detail"] ?? "failed"
            this.toast.error(getError, 'Error')
            return of(addToCartItemFailure({ error: getError }))
          })
        )
      })
    )
  })

  
  constructor(private action$: Actions, private productService: ProductService, private store: Store, private toast: ToastrService) {}
}