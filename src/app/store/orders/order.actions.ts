import { createAction, props } from "@ngrx/store";
import { AllOrders } from "../../types";

export const getAdminOrders = createAction('[orders] get admin orders', props<{params?: Record<string, string>}>())
export const gotAdminOrders = createAction('[orders] got admin orders', props<AllOrders>())
export const deleteAllAdminOrders = createAction('[orders] delete all admin orders', props<{ deleteList: string[] }>())

export const getUserOrders = createAction('[orders] get user orders', props<{params?: Record<string, string>}>())
export const gotUserOrders = createAction('[orders] got user orders', props<AllOrders>())
export const deleteAllUserOrders = createAction('[orders] delete all user orders', props<{ deleteList: string[] }>())