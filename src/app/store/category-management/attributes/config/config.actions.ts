import { createAction, props } from "@ngrx/store";
import { CategoryAndConfig, Configuration, ConfigurationEdit, EditConfigResponse } from "../../../../types";

export const getVariant = createAction('[category] get variant')

export const sendConfig = createAction('[category] send category config', props<Configuration>())

export const getCategoriesAndConfig = createAction('[category] get categories and config')

export const gotCategoryAndConfig = createAction('[category] got categories and config', props<{categories: CategoryAndConfig[] }>())

export const getSingleCategoryAndConfig = createAction('[category] get single category', props<{id: string}>())

export const gotSingleCategory = createAction('[category] got single category', props<EditConfigResponse>())

export const deleteCategoriesAndConfig = createAction('[category] delete categories', props<{ deleteList: string[] }>())

export const resetEditState = createAction('[category] reset edit state')

export const sendEditedConfig = createAction('[category] send edited config', props<{id: string, configuration: ConfigurationEdit}>())

export const uploadCoverImage = createAction('[category] upload cover image', props<{ form: FormData }>())

export const gotCoverImage = createAction('[category] got cover image', props<{ url: string }>())

export const resetImage = createAction('[category] reset cover image')