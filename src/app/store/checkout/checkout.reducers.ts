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
    message: '',
    status: 0,
    trackingId: '',
    trackingUrl: ''
}

export const verificationFeature = createFeature({
    name: 'verification',
    reducer: createReducer(
        verificationState,
        on(gotPaymentVerification, ({ message, status, trackingId, trackingUrl }) => {   
            // TODO - change for deployment
            const verification: PaymentVerification = JSON.parse(
                sessionStorage.getItem('order')!
              );
            return verification
        })
    )
})

export const { selectStatus, selectVerificationState } = verificationFeature