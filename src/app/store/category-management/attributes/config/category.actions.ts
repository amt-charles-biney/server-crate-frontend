import { createAction, props } from "@ngrx/store";
import { CategoryConfig, Configuration } from "../../../../types";

export const getVariant = createAction('[category] get variant')

export const sendConfig = createAction('[category] send category config', props<Configuration>())