import { createFeature, createReducer, on } from "@ngrx/store";
import { gotNotifications } from "./notifications.actions";
import { NotificationData } from "../../../types";

const initialNotificationState: NotificationData = {
    attributeResponseList: [],
    count: 0
}

export const notificationFeature = createFeature({
    name: 'notifications',
    reducer: createReducer(
        initialNotificationState,
        on(gotNotifications, (_, { attributeResponseList, count }) => {
            return {
                attributeResponseList,
                count
            }
        })
    )
})

export const { selectAttributeResponseList, selectCount } = notificationFeature