import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, mergeMap, of, tap } from "rxjs";
import { map, exhaustMap, catchError } from "rxjs";
import { ProductService } from "../../core/services/product/product.service";
import { addToCartItem, addToCartItemFailure, addToCartItemSuccess, loadProduct, loadProductConfig, loadProductConfigFailure, loadProductConfigItem, loadProductConfigItemFailure, loadProductConfigItemSuccess, loadProductConfigSuccess, loadProductFailure, loadProductSuccess } from "./product-spec.action";
import { ICategoryConfig, IConfiguredProduct, IParamConfigOptions, ProductItem } from "../../types";

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
            console.log("get product error ", error)
           return of(loadProductFailure({ error: getError }))
          })
        )
      })
    )
  })

  loadProductSuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(loadProductSuccess),
      map(action => loadProductConfig({ categoryId: action.product.category.id }))
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
            console.log("load product config item error ", error["error"]["detail"])
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
          map((productCartItem: IConfiguredProduct) => {
            console.log("load cart item posted success ", productCartItem)
            return addToCartItemSuccess({ productCartItem })
          }),
          catchError((error: any) => {
            console.log("load cart item posted error ", error)
            const getError: string = error["error"]["detail"] ?? "failed"
            return of(addToCartItemFailure({ error: getError }))
          })
        )
      })
    )
  })

  
  constructor(private action$: Actions, private productService: ProductService) {}
}