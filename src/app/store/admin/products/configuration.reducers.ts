import { createFeature, createReducer, on } from '@ngrx/store';
import { BasicConfig } from '../../../types';
import { gotConfiguration, resetConfiguration } from './categories.actions';

const initialState: BasicConfig = {
  category: {
    id: '',
    name: ''
  },
  id: '',
  options: {},
  inStock: {
    attributeResponse: '',
    inStock: 0,
    name: ''
  }
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
            inStock: data.inStock
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
          inStock: {
            attributeResponse: '',
            inStock: 0,
            name: ''
          }
        }
    }),
  ),
});

export const {
    name,
    reducer,
    selectConfigurationState,
} = configurationFeature