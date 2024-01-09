import { createAction, props } from "@ngrx/store";
import { ProductItem } from "../../../types";

export const loadFeaturedProducts = createAction('[featuredProducts Component] get all featured products')
export const loadFeaturedProductsSuccess = createAction('[featuredProducts Component] get all featured products', props<{ featuredProducts: ProductItem[]}>())
export const loadFeaturedProductsFailure = createAction('[featuredProducts Component] get all featured products', props<{ error: any }>())

export const loadNewProducts = createAction('[featuredProducts Component] get all new products')
export const loadNewProductsSuccess = createAction('[featuredProducts Component] get all new products', props<{ newProducts: ProductItem[]}>())
export const loadNewProductsFailure = createAction('[featuredProducts Component] get all new products', props<{ error: any }>())