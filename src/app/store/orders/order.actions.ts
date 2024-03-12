import { createAction, props } from "@ngrx/store";
import { AllOrders } from "../../types";

export const getAdminOrders = createAction('[orders] get admin orders', props<{params?: Record<string, string>}>())

export const gotAdminOrders = createAction('[orders] got admin orders', props<AllOrders>())

export const deleteAdminOrder = createAction('[orders] delete admin order', props<{ id: string }>())
export const deleteAllAdminOrders = createAction('[orders] delete all admin orders', props<{ deleteList: string[] }>())