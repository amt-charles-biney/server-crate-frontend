import { createFeature, createReducer, on } from "@ngrx/store";
import { Case } from "../../types";
import { gotCases, gotSingleCase, resetCase } from "./case.actions";

export const caseInitialState: { cases: Case[], totalCases: number, case: Case} = {
    cases: [],
    totalCases: 0,
    case: {
        coverImageUrl: '',
        description: '',
        id: '',
        imageUrls: [],
        incompatibleVariants: [],
        name: '',
        price: 0
    }
}
export const caseFeature = createFeature({
    name: 'caseFeature',
    reducer: createReducer(
        caseInitialState,
        on(gotCases, (state, { cases }) => {
            return {
                ...state,
                cases: cases.content,
                totalCases: cases.totalElements
            }
        }),
        on(gotSingleCase, (state, caseProp) => {
            return {
                ...state,
                case: caseProp
            }
        }),
        on(resetCase, (state) => {
            return {
                ...state,
                case: caseInitialState.case
            }
        })
    )
})

export const { selectCases, selectTotalCases, selectCase } = caseFeature