import { createFeature, createReducer, on } from "@ngrx/store";
import { CategoryAndConfig, EditConfigResponse } from "../../../../types";
import { gotCategoryAndConfig, gotSingleCategory, resetEditState } from "./config.actions";

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
    config: [],
    id: '',
}
export const editConfigFeature = createFeature({
    name: 'editConfig',
    reducer: createReducer(
        editConfigInitialState,
        on(gotSingleCategory, (state, {config, id, name }) => {
            return {
                name,
                id, 
                config,
            }
        }),
        on(resetEditState, () => {
            return {
                name: '',
                config: [],
                id: '',
            }
        })
    )
})
export const { selectCategoryAndConfigState } = configFeature
export const { selectConfig, selectName, selectId, selectEditConfigState } = editConfigFeature