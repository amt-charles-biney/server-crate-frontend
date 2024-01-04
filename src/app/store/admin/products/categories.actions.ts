import { createAction, props } from "@ngrx/store";
import { AllProducts, Select, DummyCategory, Item, ProductItem } from "../../../types";

export const getCategories = createAction('[products] get categories')
export const getBrands = createAction('[products] get brands')

export const gotCategories = createAction('[products] got categories', props<{ categories: Select[]}>())
export const gotBrands = createAction('[products] got brands', props<{ brands: Select[]}>())

export const categoryFailure = createAction('[products] category failure')

export const addProduct = createAction('[products] add product', props<FormData>())

export const getProduct = createAction('[products] get single product', props<Item>())

export const getProducts = createAction('[products] get products', props<{page: number}>())

export const gotProduct = createAction('[products] got product', props<ProductItem>())

export const gotProducts = createAction('[products] got products', props<{products: AllProducts}>())

export const getConfiguration = createAction('[products] get category config', props<Select>())

export const gotConfiguration = createAction('[products] got category config', props<any>())

export const deleteProduct = createAction('[products] delete product', props<Item>())