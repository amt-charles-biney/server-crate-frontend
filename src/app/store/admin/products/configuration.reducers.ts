import { createFeature, createReducer, on } from '@ngrx/store';
import { BasicConfig } from '../../../types';
import { gotConfiguration, resetConfiguration } from './categories.actions';

const initialState: BasicConfig = {
    category: {
        name: '',
        id: ''
    },
    id: '',
    options: {}
}
export const configurationFeature = createFeature({
  name: 'configuration',
  reducer: createReducer(
    initialState,
    on(gotConfiguration, (_, data) => {
        console.log('reducer config', data);
        
        return {
            category: data.category,
            id: data.id,
            options: data.options,
        }
    }),
    on(resetConfiguration, () => ({
        category: {
            name: '',
            id: ''
        },
        id: '',
        options: {}
    }))
  ),
});

export const {
    name,
    reducer,
    selectConfigurationState,
    selectOptions,
    selectCategory,
    selectId,
} = configurationFeature