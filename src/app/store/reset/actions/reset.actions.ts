import { createAction, props } from "@ngrx/store";
import { ResetLink, ResetPassword, VerifyOtp } from "../../../types";

export const sendingResetLink = createAction('[Reset] Sending reset link', props<ResetLink>())

export const sendNewPassword = createAction('[Reset] Sending new password', props<ResetPassword>())

export const verifyingOtp = createAction('[Reset] Verifying otp', props<VerifyOtp>())


