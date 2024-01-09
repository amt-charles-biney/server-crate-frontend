import { createFeature, createReducer, on } from '@ngrx/store';
import { loadFeaturedProducts, loadFeaturedProductsFailure, loadFeaturedProductsSuccess } from './featured-product.action';
import { ProductItem } from '../../../types';

interface FeatureState {
    featuredProducts: ProductItem[] | []
    loading: boolean,
    error: any
}

const initialState : FeatureState  = {
    featuredProducts: [],
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
        }))

    )
})

export const {
     selectFeaturedProducts,
     selectLoading,
     selectError,
     reducer,
     name
} = FeaturedProductFeature;