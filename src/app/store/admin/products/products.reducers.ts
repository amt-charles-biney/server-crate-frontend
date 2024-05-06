import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import {
  AllProducts,
  Comparison,
  Product,
  ProductItemSubset,
  CallState,
  LoadingState,
} from './../../../types';
import {
  gotAllProducts,
  getUserProducts,
  gotProduct,
  gotProducts,
  gotProductsFailure,
  gotRecommendations,
  gotSingleProduct,
  resetProduct,
  updateUserProduct,
  addToWishlist,
  removeFromWishlist,
  startLoader,
  wishlistUpdateFailure,
} from './categories/categories.actions';
import { getUniqueId } from '../../../core/utils/settings';
export const productInitialState: AllProducts = {
  content: [],
  totalElements: 0,
  size: 0,
  totalPages: 0,
  product: {
    productName: '',
    productDescription: '',
    productPrice: 0,
    productId: `${getUniqueId(2)}`,
    productBrand: {
      name: '',
      price: 0,
    },
    id: '',
    imageUrl: [],
    coverImage: '',
    inStock: 0,
    sales: 0,
    category: {
      name: '',
      id: '',
    },
    isFeatured: false,
    serviceCharge: 0,
    stockStatus: 'Available',
    totalLeastStock: [],
    productAvailability: true,
  },
  callState: LoadingState.INIT,
};

export const productsFeature = createFeature({
  name: 'products',
  reducer: createReducer(
    productInitialState,
    on(getUserProducts, (state) => ({
      ...state,
      callState: LoadingState.LOADING,
    })),
    on(gotProducts, (state, { products }) => ({
      ...state,
      content: [...products.content],
      totalElements: products.totalElements,
      size: products.size,
      totalPages: products.totalPages,
      callState: LoadingState.LOADED,
    })),
    on(gotProductsFailure, (state, { errorMessage }) => {
      return {
        ...state,
        callState: { errorMessage },
      };
    }),
    on(gotProduct, (state, product) => ({ ...state, product })),
    on(resetProduct, (state) => {
      return {
        ...state,
        product: productInitialState.product,
      };
    }),
    on(updateUserProduct, (state, { id }) => {
      const newContent = state.content.map((productItem) => {
        if (productItem.id === id) {
          return {
            ...productItem,
            isWishListItem: !productItem.isWishListItem,
            isLoading: false,
          };
        }
        return productItem;
      });
      return {
        ...state,
        content: newContent,
      };
    }),
    on(wishlistUpdateFailure, (state, { id }) => {
      const newContent = state.content.map((productItem) => {
        if (productItem.id === id) {
          return {
            ...productItem,
            isLoading: false,
          };
        }
        return productItem;
      });
      return {
        ...state,
        content: newContent,
      };
    }),
    on(startLoader, (state, { id }) => {
      const newContent = state.content.map((productItem) => {
        if (productItem.id === id) {
          return {
            ...productItem,
            isLoading: true,
          };
        }
        return productItem;
      });

      return {
        ...state,
        content: newContent,
      };
    })
  ),
});

export const {
  name,
  reducer,
  selectContent,
  selectProduct,
  selectTotalElements,
  selectCallState,
  selectProductsState,
} = productsFeature;

const recommendationState: ProductItemSubset[] = [];

export const recommendationsFeature = createFeature({
  name: 'recommended',
  reducer: createReducer(
    recommendationState,
    on(gotRecommendations, (_, { recommendations }) => {
      return recommendations;
    })
  ),
});

export const { selectRecommendedState } = recommendationsFeature;

const allProductsInit: {
  products: Product[];
  singleProduct: Comparison | null;
} = {
  products: [],
  singleProduct: null,
};

export const allProductsFeature = createFeature({
  name: 'allProducts',
  reducer: createReducer(
    allProductsInit,
    on(gotAllProducts, (state, { products }) => {
      return {
        ...state,
        products,
      };
    }),
    on(gotSingleProduct, (state, singleProduct) => {
      return {
        ...state,
        singleProduct: singleProduct,
      };
    })
  ),
});

export const { selectAllProductsState, selectProducts, selectSingleProduct } =
  allProductsFeature;
