import { createAction, props } from "@ngrx/store";
import { Category, DummyCategory } from "../../../types";

export const getCategories = createAction('[products] get categories')

export const gotCategories = createAction('[products] got categories', props<{ categories: DummyCategory[]}>())

export const categoryFailure = createAction('[products] category failure')

