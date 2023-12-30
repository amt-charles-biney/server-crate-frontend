import { createFeature, createReducer, on } from '@ngrx/store';
import { BasicConfig, Category } from '../../../types';
import { gotCategories, gotConfiguration } from './categories.actions';

const initialState: BasicConfig = {
    category: {
        categoryName: '',
        id: ''
    },
    id: '',
    options: {}
}
export const configurationFeature = createFeature({
  name: 'configuration',
  reducer: createReducer(
    initialState,
    on(gotConfiguration, (state, data) => {
        console.log('reducer config', data);
        
        return {
            category: data.category,
            id: data.id,
            options: data.options,
        }
    })
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