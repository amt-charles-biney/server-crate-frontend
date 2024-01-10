import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, mergeMap, of, tap } from "rxjs";
import { map, exhaustMap, catchError } from "rxjs";
import { ProductService } from "../../core/services/product/product.service";
import { loadProduct, loadProductConfig, loadProductConfigFailure, loadProductConfigSuccess, loadProductFailure, loadProductSuccess } from "./product-spec.action";
import { ProductItem } from "../../types";

@Injectable()
export class ProductSpecEffects {

  loadProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(loadProduct),
      exhaustMap((props: { id: string}) => {
        return this.productService.getProduct(props.id).pipe(
          map((product: ProductItem) => {
            console.log("product is ", product)
            return loadProductSuccess({ product })}),
          catchError((error: any) => {
            console.log("get product error ", error)
           return of(loadProductFailure({ error }))
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
          map((productConfig: any) => {
            console.log("config is ", productConfig)
            return loadProductConfigSuccess({ productConfig })
          }),
          catchError((error: any) => {
            console.log("product config error ", error)
            return of(loadProductConfigFailure({ error }))
          })
        )
      })
    )
  })
  constructor(private action$: Actions, private productService: ProductService) {}
}