import { createFeature, createReducer, on } from '@ngrx/store';
import { loadFeaturedProducts, loadFeaturedProductsFailure, loadFeaturedProductsSuccess, loadNewProducts, loadNewProductsFailure, loadNewProductsSuccess } from './featured-product.action';
import { ProductItem } from '../../../types';

interface FeatureState {
    featuredProducts: ProductItem[] | [],
    newProducts: ProductItem[] | []
    loading: boolean,
    error: any
}

const initialState : FeatureState  = {
    featuredProducts: [],
    newProducts: [],
    loading: false,
    error: null
}

export const FeaturedProductFeature = createFeature({
    name: "featured-product",
    reducer: createReducer(
        initialState,
        on(loadFeaturedProducts, (state) => ({
            ...state,
            loading: true
        })),
        on(loadFeaturedProductsSuccess, (state, { featuredProducts }) => ({
            ...state,
            loading: false,
            featuredProducts
        })),
        on(loadFeaturedProductsFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error
        })),
        on(loadNewProducts, (state) => ({
            ...state,
            loading: true
        })),
        on(loadNewProductsSuccess, (state, { newProducts }) => ({
            ...state,
            loading: false,
            newProducts
        })),
        on(loadNewProductsFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error
        }))

    )
})

export const {
     selectFeaturedProducts,
     selectNewProducts,
     selectLoading,
     selectError,
     reducer,
     name
} = FeaturedProductFeature;