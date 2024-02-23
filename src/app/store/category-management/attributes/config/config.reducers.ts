import { createFeature, createReducer, on } from "@ngrx/store";
import { CategoryAndConfig, EditConfigResponse } from "../../../../types";
import { gotCategoryAndConfig, gotCoverImage, gotSingleCategory, resetEditState, resetImage } from "./config.actions";

const initialState: CategoryAndConfig[] = []

export const configFeature = createFeature({
    name: 'categoryAndConfig',
    reducer: createReducer(
        initialState,
        on(gotCategoryAndConfig, (state, { categories }) => {
            return categories
        })
    )
})

const editConfigInitialState: EditConfigResponse = {
    name: '',
    thumbnail: '',
    config: [],
    id: '',
}
export const editConfigFeature = createFeature({
    name: 'editConfig',
    reducer: createReducer(
        editConfigInitialState,
        on(gotSingleCategory, (state, {config, id, thumbnail, name }) => {
            return {
                name,
                id, 
                config,
                thumbnail
            }
        }),
        on(resetEditState, () => {
            return {
                name: '',
                config: [],
                id: '',
                thumbnail: ''
            }
        })
    )
})

const categoryImageState: string = ''

export const categoryImageFeature = createFeature({
    name: 'categoryImage',
    reducer: createReducer(
        categoryImageState,
        on(gotCoverImage, (_, { url }) => {
            return url
        }),
        on(resetImage, () => {
            return ""
        })
    )
})
export const { selectCategoryAndConfigState } = configFeature;
export const { selectConfig, selectName, selectId, selectEditConfigState } = editConfigFeature;
export const { selectCategoryImageState } = categoryImageFeature