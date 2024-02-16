import { createAction, props } from '@ngrx/store';
import {
  AllProducts,
  Select,
  Item,
  ProductItem,
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
  props<FormData>()
);

export const getProduct = createAction(
  '[products] get single product',
  props<Item>()
);

export const getProducts = createAction(
  '[products] get products',
  props<{ page: number }>()
);

export const getUserProducts = createAction(
  '[products] get user products',
  props<{ page: number; params: string }>()
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
export const getUserConfiguration = createAction(
  '[products] get user category config',
  props<Select>()
);

export const gotConfiguration = createAction(
  '[products] got category config',
  props<any>()
);

export const resetConfiguration = createAction('[products] reset config');

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
