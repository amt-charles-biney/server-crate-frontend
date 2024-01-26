import { createFeature, createReducer, on } from "@ngrx/store";
import { CategoryAndConfig, EditConfig } from "../../../../types";
import { gotCategoryAndConfig, gotSingleCategory, resetEditState } from "./config.actions";
import { state } from "@angular/animations";

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

const editConfigInitialState: EditConfig = {
    name: '',
    config: [],
    id: '',
    incompatible: {}
}
export const editConfigFeature = createFeature({
    name: 'editConfig',
    reducer: createReducer(
        editConfigInitialState,
        on(gotSingleCategory, (state, {config, id, name, incompatible }) => {
            return {
                name,
                id, 
                config,
                incompatible
            }
        }),
        on(resetEditState, () => {
            return {
                name: '',
                config: [],
                id: '',
                incompatible: {}
            }
        })
    )
})
export const { selectCategoryAndConfigState } = configFeature
export const { selectConfig, selectName, selectId, selectEditConfigState } = editConfigFeature