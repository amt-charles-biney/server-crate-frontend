import { Attribute } from "@angular/core";
import { createFeature, createReducer, on } from "@ngrx/store";
import { gotAttributes } from "./category.actions";

const initialState: Attribute[] = []

export const attributeFeature = createFeature({
    name: 'attributes',
    reducer: createReducer(
        initialState,
        on(gotAttributes, (_, { attributes }) => [...attributes])
    )
})

export const {
    name,
    reducer,
    selectAttributesState
} = attributeFeature