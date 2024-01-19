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
    on(ProductConfigActions.loadProductConfigItem, state => ({...state, loading: true, error: null})),
    on(ProductConfigActions.loadProductConfigItemSuccess, (state, { productConfigItem }) => ({...state, productConfigItem, loading: false})),
    on(ProductConfigActions.loadProductConfigItemFailure, (state, { error }) => ({...state, error: error, loading: false }))
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
} =  productConfigItemFeature