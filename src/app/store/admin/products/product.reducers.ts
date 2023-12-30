// import { createFeature, createReducer, on } from '@ngrx/store';
// import { ProductItem } from '../../../types';
// import { gotProduct } from './categories.actions';

// const initialState: { product: ProductItem } = {
//   product: {
//     brand: '',
//     id: '',
//     imageUrl: '',
//     inStock: 0,
//     productName: '',
//     productPrice: '',
//     sales: 0,
//     productId: '',
//     productDescription: ''
//   },
// };
// export const productFeature = createFeature({
//   name: 'product',
//   reducer: createReducer(
//     initialState,
//     on(gotProduct, (state, product) => ({ product }))
//   ),
// });

// export const { name, reducer, selectProduct } = productFeature;
