import { createAction, props } from "@ngrx/store";
import { NotificationData } from "../../../../types";

export const getNotifications = createAction('[notifications] get notifications')
export const gotNotifications = createAction('[notifications] got notifications', props<NotificationData>())