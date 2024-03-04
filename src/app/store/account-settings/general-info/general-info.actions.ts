import { ChangeContact, GeneralInfo, ShippingPayload } from './../../../types';
import { createAction, props } from "@ngrx/store";

export const getGeneralInfo = createAction('[general info] get info')

export const gotGeneralInfo = createAction('[general info] got info successfully', props<GeneralInfo>())

export const changeNumber = createAction('[general info] changing contact', props<ChangeContact>())

export const saveShippingDetails = createAction('[shipping] save shipping', props<ShippingPayload>())

export const getShippingDetails = createAction('[shipping] get shipping details')

export const gotShippingDetails = createAction('[shipping] got shipping details', props<ShippingPayload>())