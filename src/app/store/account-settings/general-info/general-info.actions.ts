import { ChangeContact, GeneralInfo } from './../../../types';
import { createAction, props } from "@ngrx/store";

export const getGeneralInfo = createAction('[general info] get info')

export const gotGeneralInfo = createAction('[general info] got info successfully', props<GeneralInfo>())

export const changeNumber = createAction('[general info] changing contact', props<ChangeContact>())