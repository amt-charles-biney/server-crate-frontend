import { createFeature, createReducer, on } from '@ngrx/store';
import { Select } from '../../../types';
import { gotBrands, gotCategories } from './categories.actions';

const initialState: { categories: Select[], brands: Select[] } = {
  categories: [],
  brands: []
};
export const categoryFeature = createFeature({
  name: 'categories',
  reducer: createReducer(
    initialState,
    on(gotCategories, (state, { categories }) => ({
      ...state,
      categories,
    })),
    on(gotBrands, (state, { brands }) => ({
      ...state,
      brands,
    })),
  ),
});


export const {
reducer,
selectBrands,
selectCategories,
selectCategoriesState
} = categoryFeature