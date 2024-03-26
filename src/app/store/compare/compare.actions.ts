import { Comparisons } from './../../types';
import { createAction, props } from "@ngrx/store";

export const getProductComparisons = createAction('[compare] get products for comparison');
export const gotProductComparisons = createAction('[compare] got products for comparison', props<Comparisons>());

