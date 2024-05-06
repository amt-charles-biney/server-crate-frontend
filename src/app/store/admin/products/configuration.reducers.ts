import { createFeature, createReducer, on } from '@ngrx/store';
import { BasicConfig } from '../../../types';
import { gotConfiguration, resetConfiguration } from './categories/categories.actions';

const initialState: BasicConfig = {
  category: {
    id: '',
    name: ''
  },
  id: '',
  options: {},
  inStock: 0,
  cases: []
}
export const configurationFeature = createFeature({
  name: 'configuration',
  reducer: createReducer(
    initialState,
    on(gotConfiguration, (state, data) => {        
        return {
            category: data.category,
            id: data.id,
            options: data.options,
            inStock: data.inStock,
            cases: data.cases
        }
    }),
    on(resetConfiguration, () => {        
        return {
          category: {
            id: '',
            name: ''
          },
          id: '',
          options: {},
          inStock: 0,
          cases: []
        }
    }),
  ),
});

export const {
    name,
    reducer,
    selectConfigurationState,
    selectCases
} = configurationFeature