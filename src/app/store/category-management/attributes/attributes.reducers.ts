import { createFeature, createReducer, on } from '@ngrx/store';
import { BulkAttribute, StoreVariant, UploadResponse } from '../../../types';
import { addAttributeToStore, gotImage, updateAttributesInStore } from './attributes.actions';

const initialState: StoreVariant[] = []

export const attributeCreationFeature = createFeature({
  name: 'attributeCreation',
  reducer: createReducer(
    initialState,
    on(gotImage, (state, { url, id }) => {
        const oldAttributes = state.filter((attribute) => attribute.id !== id )
        const newAttribute: StoreVariant = {
            baseAmount: '',
            id,
            maxAmount: '',
            media: url,
            name: '',
            price: '',
            priceIncrement: '',
        }
        return [
            ...oldAttributes,
            newAttribute
        ]
    }),
    on(addAttributeToStore, (state,  props ) => {        
        const newAttribute: StoreVariant = {
           ...props
        }
        
        return [
            ...state,
            newAttribute
        ]
    }),
    on(updateAttributesInStore, (state, props) => {
        const newState = props.attributes.map(
            (attr, index) => {
                return {
                    ...attr,
                    media: state[index].media 
                }
            }
        )
        return newState
    })
  ),
});

export const { selectAttributeCreationState } = attributeCreationFeature;
