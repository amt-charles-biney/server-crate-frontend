import { createAction, props } from '@ngrx/store';
import { ProductItem } from '../../types';

export const loadProduct = createAction('[ProductConfig Component] Get Product', props<{ id: string }>());

export const loadProductSuccess = createAction(
  '[ProductConfig Component] Get Product Success',
  props<{ product: ProductItem }>() 
);

export const loadProductFailure = createAction(
  '[ProductConfig Component] Get Product Failure',
  props<{ error: any }>() 
);

export const loadProductConfig = createAction('[ProductConfig Component] Get Product Config', props<{ categoryId: string }>());

export const loadProductConfigSuccess = createAction(
  '[ProductConfig Component] Get Product Config Success',
  props<{ productConfig: any }>() 
);

export const loadProductConfigFailure = createAction(
  '[ProductConfig Component] Get Product Config Failure',
  props<{ error: any }>()
);
