import { createFeature, createReducer, on } from "@ngrx/store";
import { AllOrders, Content } from "../../types";
import { gotAdminOrders, gotOrder, gotUserOrders, resetOrderDetail } from "./order.actions";

const orderInitialState: AllOrders = {
    content: [],
    size: 0,
    totalElements: 0,
    totalPages: 0
}

export const orderFeature = createFeature({
    name: 'orders',
    reducer: createReducer(
        orderInitialState,
        on(gotAdminOrders, (_, { content, size, totalElements, totalPages }) => {
            return {
                content,
                size,
                totalElements,
                totalPages
            }
        }),
        on(gotUserOrders, (_, { content, size, totalElements, totalPages }) => {
            return {
                content,
                size,
                totalElements,
                totalPages
            }
        })
    )
})

export const { selectOrdersState } = orderFeature


const orderState: Content = {
    configuredProduct: [],
    customerName: '',
    date: '',
    id: '',
    orderId: '',
    paymentMethod: '',
    productCoverImage: '',
    productName: '',
    status: '',
    totalPrice: 0,
    trackingUrl: '',
    brandName: '',
    estArrival: '',
    shippingAddress: ''
}


export const singleOrderFeature = createFeature({
    name: 'singleOrder',
    reducer: createReducer(
        orderState,
        on(gotOrder, (_, order) => {
            return order
        }),
        on(resetOrderDetail, () => {
            return orderState
        })
    )
})

export const { selectSingleOrderState } = singleOrderFeature