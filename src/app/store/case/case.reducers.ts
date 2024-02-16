import { createFeature, createReducer, on } from "@ngrx/store";
import { Case } from "../../types";
import { gotCases } from "./case.actions";

const caseInitialState: Case[] = []
export const caseFeature = createFeature({
    name: 'caseFeature',
    reducer: createReducer(
        caseInitialState,
        on(gotCases, (_, { cases }) => {
            return cases
        })
    )
})

export const { selectCaseFeatureState } = caseFeature