import { createFeature, createReducer, on } from "@ngrx/store";
import { AllOrders } from "../../types";
import { gotAdminOrders } from "./order.actions";

const orderInitialState: AllOrders = {
    content: [],
    size: 0,
    totalElements: 0,
    totalPages: 0
}

export const orderFeature = createFeature({
    name: 'adminOrders',
    reducer: createReducer(
        orderInitialState,
        on(gotAdminOrders, (_, { content, size, totalElements, totalPages }) => {
            return {
                content,
                size,
                totalElements,
                totalPages
            }
        })
    )
})

export const { selectAdminOrdersState } = orderFeature