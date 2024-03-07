import { verificationFailure } from './../signup/actions/signup.actions';
import { createFeature, createReducer, on } from "@ngrx/store";
import { PaymentData, PaymentVerification,  } from "../../types";
import { gotPaymentResponse, gotPaymentVerification } from "./checkout.actions";

const checkoutInitialState: PaymentData = {
    access_code: '',
    authorization_url: '',
    reference: '',
}


export const checkoutFeature = createFeature({
    name: 'checkout',
    reducer: createReducer(
        checkoutInitialState,
        on(gotPaymentResponse, (_, { access_code, authorization_url, reference }) => {
            return {
                access_code,
                authorization_url,
                reference,
            }
        })
    )
})

const verificationState: PaymentVerification = {
    isVerified: false,
    status: 0,
    message: '',
}

export const verificationFeature = createFeature({
    name: 'verification',
    reducer: createReducer(
        verificationState,
        on(gotPaymentVerification, ({ isVerified, message, status}) => {                        
            return {
                isVerified: true,
                message,
                status
            }
        })
    )
})

export const { selectIsVerified } = verificationFeature