import { createFeature, createReducer, on } from '@ngrx/store';
import * as ProductConfigActions from './product-spec.action'; 
import { IConfiguredProduct, ProductItem } from '../../types';

export interface ProductConfigState {
  product: ProductItem | null;
  productConfig: any | null;
  loading: boolean;
  error: any;
}

export interface ProductConfigItemState {
  productConfigItemLoading: any,
  productConfigItemError: any,
  productConfigItem: IConfiguredProduct | null
}

export interface ProductCartItemState {
  productCartItem: IConfiguredProduct | null,
  productCartItemLoading: boolean,
  productCartItemError: any,
  message: String | null
}

export const initialState: ProductConfigState = {
  product: null,
  productConfig: null,
  loading: false,
  error: null
};

export const ProductConfigInitialState : ProductConfigItemState =  {
  productConfigItemLoading: false,
  productConfigItemError: null,
  productConfigItem: null
}

export const ProductCartInitialState: ProductCartItemState = {
  productCartItem: null,
  productCartItemLoading: false,
  productCartItemError: null,
  message: null
}

export const productConfigFeature = createFeature({
  name: 'productconfig',
  reducer: createReducer(
    initialState,
    on(ProductConfigActions.loadProduct, state => ({ ...state, loading: true, error: null })),
    on(ProductConfigActions.loadProductSuccess, (state, { product }) => ({ ...state, product, loading: false })),
    on(ProductConfigActions.loadProductFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(ProductConfigActions.loadProductConfig, state => ({ ...state, loading: true, error: null })),
    on(ProductConfigActions.loadProductConfigSuccess, (state, { productConfig }) => ({ ...state, productConfig, loading: false })),
    on(ProductConfigActions.loadProductConfigFailure, (state, { error }) => ({ ...state, error, loading: false }))
)
})

export const productConfigItemFeature = createFeature({
  name: 'productConfigItem',
  reducer: createReducer(
    ProductConfigInitialState,
    on(ProductConfigActions.loadProductConfigItem, state => ({...state, productConfigItemLoading: true, productConfigItemError: null})),
    on(ProductConfigActions.loadProductConfigItemSuccess, (state, { productConfigItem }) => ({...state, productConfigItem, productConfigItemLoading: false})),
    on(ProductConfigActions.loadProductConfigItemFailure, (state, { error }) => ({...state, productConfigItemError: error, productConfigItemLoading: false }))
  )
})

export const productCartItemFeature = createFeature({
  name: 'productCartItem',
  reducer: createReducer(
    ProductCartInitialState,
    on(ProductConfigActions.addToCartItem, state => ({...state, productCartItemLoading: true, productCartItemError: null, message: null})),
    on(ProductConfigActions.addToCartItemSuccess, (state, { message, configuration }) => ({...state, productCartItem: configuration, message,  productCartItemLoading: false})),
    on(ProductConfigActions.addToCartItemFailure, (state, { error }) => ({...state, productCartItemError: error, productCartItemLoading: false , message: null})),
    on(ProductConfigActions.resetCartMessage, (state) => ({...state, message: null}))

  )
})

export const {
  name,
  reducer,
  selectProductconfigState,
  selectError,
  selectLoading,
  selectProductConfig,
  selectProduct
} = productConfigFeature

export const {
  selectProductConfigItemState,
  selectProductConfigItem,
  selectProductConfigItemLoading,
  selectProductConfigItemError
} = productConfigItemFeature

export const {
  selectProductCartItem,
  selectProductCartItemError,
  selectProductCartItemLoading,
  selectProductCartItemState,
  selectMessage
} = productCartItemFeature
