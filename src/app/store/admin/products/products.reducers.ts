import { createFeature, createReducer, on } from '@ngrx/store';
import { AllProducts } from './../../../types';
import { gotProduct, gotProducts, resetProduct } from './categories.actions';
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
      price: 0
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
    totalLeastStock: []
  },
};

export const productsFeature = createFeature({
  name: 'products',
  reducer: createReducer(
    productInitialState,
    on(gotProducts, (state, { products }) => ({
      ...state,
      content: [...products.content],
      totalElements: products.totalElements,
      size: products.size,
      totalPages: products.totalPages
    })),
    on(gotProduct, (state, product) => ({ ...state, product })),
    on(resetProduct, (state) => {
      return {
        ...state,
        product: productInitialState.product
      }
    })
  ),
});

export const {
  name,
  reducer,
  selectContent,
  selectProduct,
  selectTotalElements
} = productsFeature;
