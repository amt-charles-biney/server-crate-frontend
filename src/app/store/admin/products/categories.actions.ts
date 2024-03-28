import { createAction, props } from '@ngrx/store';
import {
  AllProducts,
  Select,
  Item,
  ProductItem,
  ProductPayload,
  ProductItemSubset,
  Wishlist,
  Product,
  Comparison,
  IParamConfigOptions,
} from '../../../types';

export const getCategories = createAction('[products] get categories');
export const getUserCategories = createAction('[products] get user categories');
export const getBrands = createAction('[products] get brands');
export const getUserBrands = createAction('[products] get user brands');

export const gotCategories = createAction(
  '[products] got categories',
  props<{ categories: Select[] }>()
);
export const gotBrands = createAction(
  '[products] got brands',
  props<{ brands: Select[] }>()
);

export const categoryFailure = createAction('[products] category failure');

export const addProduct = createAction(
  '[products] add product',
  props<ProductPayload>()
);

export const updateProduct = createAction(
  '[products] update product',
  props<{ id: string, product: ProductPayload}>()
)


export const getProduct = createAction(
  '[products] get single product',
  props<Item>()
);

export const getProducts = createAction(
  '[products] get products',
  props<{ page: number }>()
);

export const getAllProducts = createAction('[products] get all products')
export const gotAllProducts = createAction('[products] got all products', props<{products: Product[]}>())
export const getSingleProduct = createAction('[products] get single comparison product', props<{ id: string }>())
export const gotSingleProduct = createAction('[products] got single product', props<Comparison>())

export const getUserProducts = createAction(
  '[products] get user products',
  props<{ page: number; params: Record<string, string> }>()
);

export const gotProduct = createAction(
  '[products] got product',
  props<ProductItem>()
);

export const gotProducts = createAction(
  '[products] got products',
  props<{ products: AllProducts }>()
);

export const  getConfiguration = createAction(
  '[products] get category config',
  props<Select>()
);

export const gotConfiguration = createAction(
  '[products] got category config',
  props<any>()
);

export const resetConfiguration = createAction('[products] reset config');
export const resetProduct = createAction('[products] reset product')

export const deleteProduct = createAction(
  '[products] delete product',
  props<Item>()
);

export const addBrand = createAction(
  '[products] add brand',
  props<{ name: string }>()
);

export const deleteBrand = createAction(
  '[products] delete brand',
  props<{ id: string }>()
);

export const addToFeature = createAction(
  '[products] add to feature',
  props<{ id: string }>()
);

export const removeFromFeature = createAction(
  '[products] remove from feature',
  props<{ id: string }>()
);

export const gotCases = createAction('[cases] get user cases', props<{ cases: Select[] }>())
export const getCases = createAction('[cases] get all cases to display for user')

export const getRecommendations = createAction('[recommendations] get recommendations')
export const gotRecommendations = createAction('[recommendations] got recommendations', props<{recommendations: ProductItemSubset[]}>())

export const getWishlist = createAction('[wishlist] get wishlist')
export const gotWishlist = createAction('[wishlist] got wishlist', props<Wishlist>())
export const addToWishlist = createAction('[wishlist] add to wishlist', props<{ id: string, configOptions: IParamConfigOptions }>())
export const removeFromWishlist = createAction('[wishlist] remove from wishlist', props<{ id: string }>())
