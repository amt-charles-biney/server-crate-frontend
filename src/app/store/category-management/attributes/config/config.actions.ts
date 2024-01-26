import { createAction, props } from "@ngrx/store";
import { CategoryAndConfig, CategoryConfig, Configuration, ConfigurationEdit, EditConfig } from "../../../../types";

export const getVariant = createAction('[category] get variant')

export const sendConfig = createAction('[category] send category config', props<Configuration>())

export const getCategoriesAndConfig = createAction('[category] get categories and config')

export const gotCategoryAndConfig = createAction('[category] got categories and config', props<{categories: CategoryAndConfig[] }>())

export const getSingleCategoryAndConfig = createAction('[category] get single category', props<{id: string}>())

export const gotSingleCategory = createAction('[category] got single category', props<EditConfig>())

export const deleteCategoriesAndConfig = createAction('[category] delete categories', props<{ deleteList: string[] }>())

export const resetEditState = createAction('[category] reset edit state')

export const sendEditedConfig = createAction('[category] send edited config', props<{id: string, configuration: ConfigurationEdit}>())