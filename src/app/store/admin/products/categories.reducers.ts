import { createFeature, createReducer, on } from '@ngrx/store';
import { Category } from '../../../types';
import { gotCategories } from './categories.actions';

const initialState: Category[] = [];
export const categoryFeature = createFeature({
  name: 'categories',
  reducer: createReducer(
    initialState,
    on(gotCategories, (state, { categories }) => [...categories])
  ),
});


export const {
reducer,
selectCategoriesState
} = categoryFeature