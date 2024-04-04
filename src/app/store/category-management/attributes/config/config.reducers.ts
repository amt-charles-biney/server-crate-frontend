import { createFeature, createReducer, on } from "@ngrx/store";
import { AllCategories, CategoryAndConfig, EditConfigResponse } from "../../../../types";
import { gotCategoryAndConfig, gotCoverImage, gotSingleCategory, resetEditState, resetImage } from "./config.actions";

const initialState: AllCategories = {
    content: [],
    size: 0,
    totalElements: 0,
    totalPages: 0
}

export const configFeature = createFeature({
    name: 'categoryAndConfig',
    reducer: createReducer(
        initialState,
        on(gotCategoryAndConfig, (_, { content, size, totalElements, totalPages }) => {
            return {
                content,
                size,
                totalElements,
                totalPages
            }
        })
    )
})

const editConfigInitialState: EditConfigResponse = {
    name: '',
    thumbnail: '',
    config: [],
    id: '',
    cases: []
}
export const editConfigFeature = createFeature({
    name: 'editConfig',
    reducer: createReducer(
        editConfigInitialState,
        on(gotSingleCategory, (state, {config, id, thumbnail, name, cases }) => {
            return {
                name,
                id, 
                config,
                thumbnail,
                cases
            }
        }),
        on(resetEditState, () => {
            return {
                name: '',
                config: [],
                id: '',
                thumbnail: '',
                cases: []
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
export const { selectContent, selectTotalElements, selectCategoryAndConfigState } = configFeature;
export const { selectConfig, selectName, selectId, selectEditConfigState } = editConfigFeature;
export const { selectCategoryImageState } = categoryImageFeature