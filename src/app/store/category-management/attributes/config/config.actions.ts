import { createAction, props } from "@ngrx/store";
import { CategoryAndConfig, CategoryConfig, Configuration } from "../../../../types";

export const getVariant = createAction('[category] get variant')

export const sendConfig = createAction('[category] send category config', props<Configuration>())

export const getCategoriesAndConfig = createAction('[category] get categories and config')

export const gotCategoryAndConfig = createAction('[category] got categories and config', props<{categories: CategoryAndConfig[] }>())

export const getSingleCategoryAndConfig = createAction('[category] get single category', props<{id: string}>())

export const deleteCategoriesAndConfig = createAction('[category] delete categories', props<{ deleteList: string[] }>())