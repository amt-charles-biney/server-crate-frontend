import { createFeature, createReducer, on } from '@ngrx/store';
import { ProductItem } from './../../../types';
import { gotProduct, gotProducts } from './categories.actions';
import { getUniqueId } from '../../../core/utils/settings';
const initialState: { products: ProductItem[]; product: ProductItem } = {
  products: [],
  product: {
    productName: '',
    productDescription: '',
    productPrice: '',
    productId: `${getUniqueId(2)}`,
    brand: '',
    id: '',
    imageUrl: '',
    coverImage: '',
    inStock: 0,
    sales: 0,
    category: {
        name: '',
        id: ''
    }
  },
};

export const productsFeature = createFeature({
  name: 'products',
  reducer: createReducer(
    initialState,
    on(gotProducts, (state, { products }) => ({
      ...state,
      products: [...products],
    })),
    on(gotProduct, (state, product) => ({...state, product }))
  ),
});

export const { name, reducer, selectProducts, selectProduct, selectProductsState } =
  productsFeature;
