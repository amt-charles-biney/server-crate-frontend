import { createFeature, createReducer, on } from '@ngrx/store';
import { ProductItem } from './../../../types';
import { gotProduct, gotProducts } from './categories.actions';
import { getUniqueId } from '../../../core/utils/settings';
const initialState: { products: ProductItem[]; product: ProductItem; total: number } = {
  products: [],
  total: 0,
  product: {
    productName: '',
    productDescription: '',
    productPrice: '',
    productId: `${getUniqueId(2)}`,
    productBrand: '',
    id: '',
    imageUrl: '',
    coverImage: '',
    inStock: 0,
    sales: 0,
    category: {
      name: '',
      id: '',
    },
    isFeatured: false
  },
};

export const productsFeature = createFeature({
  name: 'products',
  reducer: createReducer(
    initialState,
    on(gotProducts, (state, { products }) => ({
      ...state,
      products: [...products.products],
      total: products.total
    })),
    on(gotProduct, (state, product) => ({ ...state, product }))
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
