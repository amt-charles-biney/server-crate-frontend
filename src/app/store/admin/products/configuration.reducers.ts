import { createFeature, createReducer, on } from '@ngrx/store';
import { BasicConfig } from '../../../types';
import { gotConfiguration, resetConfiguration } from './categories.actions';

const initialState: BasicConfig[] = []
export const configurationFeature = createFeature({
  name: 'configuration',
  reducer: createReducer(
    initialState,
    on(gotConfiguration, (state, data) => {        
        return [...state, {
            category: data.category,
            id: data.id,
            options: data.options,
        }]
    }),
    on(resetConfiguration, () => {        
        return []
    }),
  ),
});

export const {
    name,
    reducer,
    selectConfigurationState,
} = configurationFeature