import { createAction, props } from "@ngrx/store";
import { Case } from "../../types";

export const getCases = createAction('[Case] get cases')

export const gotCases = createAction('[Case] got cases', props<{cases: Case[]}>())

export const getSingleCase = createAction('[Case] get single case')

export const gotSingleCase = createAction('[Case] got single case', props<Case>())