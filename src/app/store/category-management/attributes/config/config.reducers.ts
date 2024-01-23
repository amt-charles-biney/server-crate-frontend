import { createFeature, createReducer, on } from "@ngrx/store";
import { CategoryAndConfig } from "../../../../types";
import { gotCategoryAndConfig } from "./config.actions";
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
export const { selectCategoryAndConfigState } = configFeature