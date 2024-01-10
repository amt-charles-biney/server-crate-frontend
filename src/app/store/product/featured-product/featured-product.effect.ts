import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of, share, shareReplay, tap } from "rxjs";
import { FeaturedProductService } from "../../../core/services/product/featured-product.service";
import { loadFeaturedProducts, loadFeaturedProductsFailure, loadFeaturedProductsSuccess, loadNewProducts, loadNewProductsFailure, loadNewProductsSuccess } from "./featured-product.action";
import { ProductItem } from "../../../types";


@Injectable()
export class FeaturedProductEffect {

    loadFeaturedProduct$ = createEffect(() => {
        return this.action$.pipe(
            ofType(loadFeaturedProducts),
            exhaustMap(() => {
                return this.featuredProductService.getFeaturedProducts().pipe(
                    map((featuredProducts: ProductItem[]) => {
                        return loadFeaturedProductsSuccess({ featuredProducts })
                    }),
                    catchError((error: any) => {
                        return of(loadFeaturedProductsFailure({ error }))
                    })
                )
            })
        )
    })

    loadNewProducts$ = createEffect(() => {
        return this.action$.pipe(
            ofType(loadNewProducts),
            exhaustMap(() => {
                return this.featuredProductService.getNewProducts().pipe(
                    map((newProducts: ProductItem[]) => {
                        return loadNewProductsSuccess({ newProducts })
                    }),
                    catchError((error: any) => {
                        return of(loadNewProductsFailure({ error }))
                    })
                )
            })
        )
    })


    constructor(private action$: Actions, private featuredProductService: FeaturedProductService) {}
}