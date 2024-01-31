import { createFeature, createReducer, on } from '@ngrx/store';
import { Attribute, StoreVariant } from '../../../types';
import { addAttributeToStore, deleteAll, deleteMultipleAttributes, gotAttributes, gotImage, putBackAttributeOptionInStore, removeAttributeOptionInStore, resetAttributeCreation, updateAttributesInStore } from './attributes.actions';

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
            priceFactor: '',
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
    }),
    on(resetAttributeCreation, () => {
        return []
    }),
  ),
});

const initialAttributes: Attribute[] = []
export const attributesFeature = createFeature({
    name: 'attributes',
    reducer: createReducer(
        initialAttributes,
        on(gotAttributes, (_, { attributes }) => {
            return attributes
        }),
        on(deleteMultipleAttributes, (state, { deleteList }) => {
            const newState = state.filter((attribute) => !deleteList.includes(attribute.id))            
            return newState
        }),
        on(deleteAll, () => {
            return []
        }),
        on(removeAttributeOptionInStore, (state, { attributeId, optionId } ) => {
            const newState = state.map((attribute) => {
                if (attribute.id === attributeId) {
                    const newAttributeOptions = attribute.attributeOptions.filter((option) => option.id !== optionId)                    
                    const newAttribute: Attribute = { ...attribute, attributeOptions: newAttributeOptions }
                    return newAttribute
                }
                return attribute
            } )
            return newState
        }),
        on(putBackAttributeOptionInStore, (state, props) => {
            const newState = state.map((attribute) => {
                if (attribute.id === props.attribute.id) {
                    const newAttributeOptions = [...attribute.attributeOptions, props ]                   
                    const newAttribute: Attribute = { ...attribute, attributeOptions: newAttributeOptions }
                    return newAttribute
                }
                return attribute
            } )
            return newState
        })

    )
})

export const { selectAttributeCreationState } = attributeCreationFeature;
export const { selectAttributesState } = attributesFeature