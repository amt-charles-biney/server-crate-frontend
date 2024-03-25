import { Customers } from './../../types';
import { createAction, props } from "@ngrx/store";

export const getCustomers = createAction('[customers] get customers')
export const gotCustomers = createAction('[customers] got customers', props<{ customers: Customers}>())