import { createFeature, createReducer, on } from "@ngrx/store";
import { Customers } from "../../types";
import { gotCustomers } from "./customers.actions";

const initialCustomerState: Customers = {
    content: [],
    size: 0,
    totalElements: 0,
    totalPages: 0
}

export const customerFeature = createFeature({
    name: 'customers',
    reducer: createReducer(
        initialCustomerState,
        on(gotCustomers, (_, { customers }) => {
            return customers
        })
    )
})

export const { selectContent, selectTotalElements } = customerFeature