import { createAction, props } from "@ngrx/store";
import { ResendOtp, SetOtp } from "../../types";

export const setOtp = createAction('[Otp] set otp', props<SetOtp>())

export const resendingOTP = createAction('[Otp] resending otp', props<ResendOtp>())