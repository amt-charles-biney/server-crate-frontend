import { createFeature, createReducer, on } from "@ngrx/store";
import { PaymentData,  } from "../../types";
import { gotPaymentResponse } from "./checkout.actions";

const checkoutInitialState: PaymentData = {
    access_code: '',
    authorization_url: '',
    reference: ''
}


export const checkoutFeature = createFeature({
    name: 'checkout',
    reducer: createReducer(
        checkoutInitialState,
        on(gotPaymentResponse, (_, { access_code, authorization_url, reference }) => {
            return {
                access_code,
                authorization_url,
                reference
            }
        })
    )
})