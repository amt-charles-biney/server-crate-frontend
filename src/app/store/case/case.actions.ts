import { createAction, props } from "@ngrx/store";
import { Case, CaseResponse, Item } from "../../types";

export const getCases = createAction('[Case] get cases')

export const getCaseList = createAction('[Case] get case list')

export const gotCases = createAction('[Case] got cases', props<{cases: CaseResponse}>())

export const getSingleCase = createAction('[Case] get single case', props<Item>())

export const gotSingleCase = createAction('[Case] got single case', props<Case>())

export const resetCase = createAction('[Case] reset case')