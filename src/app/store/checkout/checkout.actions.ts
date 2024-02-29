import { createAction, props } from "@ngrx/store";
import { PaymentData, PaymentRequest } from "../../types";

export const sendingPaymentRequest = createAction('[checkout] sending payment request', props<PaymentRequest>())

export const gotPaymentResponse = createAction('[checkout] got payment response', props<PaymentData>())

export const verifyPayment = createAction('[checkout] verify payment', props<{ reference: string }>())