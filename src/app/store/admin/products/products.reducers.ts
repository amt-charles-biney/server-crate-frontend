import { createFeature, createReducer, on } from '@ngrx/store';
import { ProductItem } from './../../../types';
import { gotProduct, gotProducts, resetProduct } from './categories.actions';
import { getUniqueId } from '../../../core/utils/settings';
export const productInitialState: { products: ProductItem[]; product: ProductItem; total: number } = {
  products: [],
  total: 0,
  product: {
    productName: '',
    productDescription: '',
    productPrice: '',
    productId: `${getUniqueId(2)}`,
    productBrand: {
      name: '',
      price: 0
    },
    id: '',
    imageUrl: '',
    coverImage: '',
    inStock: 0,
    sales: 0,
    category: {
      name: '',
      id: '',
    },
    isFeatured: false,
    serviceCharge: '',
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
      products: [...products.products],
      total: products.total
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
  selectProducts,
  selectProduct,
  selectProductsState,
  selectTotal
} = productsFeature;
