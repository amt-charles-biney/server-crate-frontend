import { createFeature, createReducer, on } from "@ngrx/store";
import { gotNotifications } from "./notifications.actions";
import { NotificationData } from "../../../types";

const initialNotificationState: NotificationData = {
    count: 0,
    lowOrZeroStock: [],
    requiredCategories: [],
    unassignedProducts: []
}

export const notificationFeature = createFeature({
    name: 'notifications',
    reducer: createReducer(
        initialNotificationState,
        on(gotNotifications, (_, { lowOrZeroStock, requiredCategories, unassignedProducts, count }) => {
            return {
                lowOrZeroStock,
                requiredCategories,
                unassignedProducts,
                count
            }
        })
    )
})

export const { selectNotificationsState, selectCount } = notificationFeature