import { createFeature, createReducer, on } from '@ngrx/store';
import { loadFeaturedProductsFailure, loadFeaturedProductsSuccess, loadNewProductsFailure, loadNewProductsSuccess } from './featured-product.action';
import { ProductItem } from '../../../types';
import { startLoader, updateUserProduct, wishlistUpdateFailure } from '../../admin/products/categories/categories.actions';

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
function updateProductFn(productItem: ProductItem, id: string) {
    if (productItem.id === id) {
      return {
        ...productItem,
        isWishListItem: !productItem.isWishListItem,
        isLoading: false
      }
    }
    return productItem
}

function updateFailureFn(productItem: ProductItem, id: string) {
  if (productItem.id === id) {
    return {
      ...productItem,
      isLoading: false
    }
  }
  return productItem
}

function startLoaderFn(productItem: ProductItem, id: string) {
  if (productItem.id === id) {
    return {
      ...productItem, 
      isLoading: true
    }
  }
  return productItem
}
export const FeaturedProductFeature = createFeature({
    name: "featured-product",
    reducer: createReducer(
        initialState,
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
        on(loadNewProductsSuccess, (state, { newProducts }) => ({
            ...state,
            loading: false,
            newProducts
        })),
        on(loadNewProductsFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error
        })),
        on(updateUserProduct, (state, { id }) => {
            const newFeaturedProducts = state.featuredProducts.map((productItem) => updateProductFn(productItem, id))
            const popularProducts = state.newProducts.map((productItem) => updateProductFn(productItem, id));
            return {
              ...state,
              featuredProducts: newFeaturedProducts,
              newProducts: popularProducts
            }
          }),
          on(wishlistUpdateFailure, (state, { id }) => {
            const newFeaturedProducts = state.featuredProducts.map((productItem) => updateFailureFn(productItem, id))
            const popularProducts = state.newProducts.map((productItem) => updateFailureFn(productItem, id))
            return {
              ...state,
              featuredProducts: newFeaturedProducts,
              newProducts: popularProducts
            }
          }),
          on(startLoader, (state, {id}) => {
            const newFeaturedProducts = state.featuredProducts.map((productItem) => startLoaderFn(productItem, id))
            const popularProducts = state.newProducts.map((productItem) => startLoaderFn(productItem, id))
      
            return {
              ...state,
              featuredProducts: newFeaturedProducts,
              newProducts: popularProducts
            }
          }),

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