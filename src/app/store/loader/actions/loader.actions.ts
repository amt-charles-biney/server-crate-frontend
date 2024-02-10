import { createAction, props } from "@ngrx/store";
import { LoadingStatus } from "../../../types";

export const setLoadingSpinner = createAction('[loading] set loading status', props<LoadingStatus>())

export const resetLoader = createAction('[loading] reset loader', props<LoadingStatus>())