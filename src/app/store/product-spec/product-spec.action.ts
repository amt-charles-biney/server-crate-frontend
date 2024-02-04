import { createAction, props } from '@ngrx/store';
import { IConfiguredProduct, IParamConfigOptions, ProductItem } from '../../types';

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

export const loadProductConfigItem = createAction('[ProductConfigItem Component] Get product Config Item', props<{productId: string, configOptions: IParamConfigOptions}>());
export const loadProductConfigItemSuccess = createAction('[ProductConfigItem Component] Get product Config Item Success', props<{ productConfigItem: IConfiguredProduct }>());
export const loadProductConfigItemFailure = createAction('[ProductConfig Component] Get Product Config Item Failure',
  props<{ error: any }>()
)

export const addToCartItem = createAction('[ProductCartItem Component] Add product Config Item to cart', props<{ productId: string, configOptions: IParamConfigOptions }>())
export const addToCartItemSuccess = createAction('[ProductCartItem Component] Add product Config item to cart success', props<{ productCartItem: IConfiguredProduct }>())
export const addToCartItemFailure = createAction('[ProductCartItem Component] Add product Config Item to cart failure', props<{ error: any }>())
