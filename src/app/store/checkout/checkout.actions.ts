import { createAction, props } from "@ngrx/store";
import { PaymentData, PaymentRequest, PaymentVerification, ShippingPayload } from "../../types";

export const sendingPaymentRequest = createAction('[checkout] sending payment request', props<PaymentRequest>())

export const gotPaymentResponse = createAction('[checkout] got payment response', props<PaymentData>())

export const verifyPayment = createAction('[checkout] verify payment', props<{ reference: string }>())

export const gotPaymentVerification =  createAction('[checkout] payment verification', props<PaymentVerification>())

export const validationSuccess = createAction('[checkout] address validation success')
export const validationFailure = createAction('[checkout] address validation failure')