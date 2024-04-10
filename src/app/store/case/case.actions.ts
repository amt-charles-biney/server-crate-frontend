import { createAction, props } from "@ngrx/store";
import { AllCases, Case, CaseResponse, Item } from "../../types";

export const getCases = createAction('[Case] get cases', props<{ page: number }>())

export const getCaseList = createAction('[Case] get case list')

export const gotCases = createAction('[Case] got cases', props<AllCases>())

export const getSingleCase = createAction('[Case] get single case', props<Item>())

export const gotSingleCase = createAction('[Case] got single case', props<Case>())

export const resetCase = createAction('[Case] reset case')

export const deleteCase = createAction('[Case] delete case', props<{ id: string }>())

export const addCase = createAction('[Case] add case', props<{formData: FormData}>())

export const updateCase = createAction('[Case] update case', props<{formData: FormData, id: string}>())