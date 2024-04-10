import { createFeature, createReducer, on } from "@ngrx/store";
import { AllCases, Case } from "../../types";
import { gotCases, gotSingleCase, resetCase } from "./case.actions";

export const caseInitialState: AllCases = {
    content: [],
    totalElements: 0,
    case: {
        coverImageUrl: '',
        description: '',
        id: '',
        imageUrls: [],
        incompatibleVariants: [],
        name: '',
        price: 0
    },
    size: 0,
    totalPages: 0
}
export const caseFeature = createFeature({
    name: 'caseFeature',
    reducer: createReducer(
        caseInitialState,
        on(gotCases, (state, { content, size, totalElements, totalPages }) => {
            return {
                ...state,
                content,
                totalElements,
                totalPages,
                size,
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

export const { selectContent, selectTotalElements, selectCase } = caseFeature