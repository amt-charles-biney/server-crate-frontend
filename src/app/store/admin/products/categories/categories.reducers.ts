import { createFeature, createReducer, on } from '@ngrx/store';
import { Select } from '../../../../types';
import { gotBrands, gotCases, gotCategories } from './categories.actions';

const initialState: { categories: Select[], brands: Select[], cases: Select[] } = {
  categories: [],
  brands: [],
  cases: []
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
    on(gotCases, (state, { cases }) => ({
      ...state,
      cases
    }))
  ),
});


export const {
reducer,
selectBrands,
selectCategories,
selectCategoriesState,
selectCases
} = categoryFeature