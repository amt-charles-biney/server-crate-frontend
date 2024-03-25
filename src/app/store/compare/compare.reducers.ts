import { createFeature, createReducer, on } from "@ngrx/store";
import { Comparisons } from "../../types";
import { gotProductComparisons } from "./compare.actions";


export const initialCompareState: Comparisons = {
    data: [],
    message: '',
    status: ''
}
export const compareFeature = createFeature({
    name: 'compare',
    reducer: createReducer(
        initialCompareState,
        on(gotProductComparisons, (state, comparisons) => {
            return {
                ...comparisons
            }
        })
    )
})

export const { selectCompareState, selectData } = compareFeature