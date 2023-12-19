import { Success, VerificationFailure, VerifiedUser, Verify, Verifying } from './../../../types';
import { createAction, props } from "@ngrx/store"
import { Failure, UserSignUp } from "../../../types"

export const signUp = createAction('[SignUp] User Signup', props<UserSignUp>())

export const signUpSuccess = createAction('[SignUp] Signup Success', props<Success>())

export const displaySuccess = createAction('[SignUp] Show Success Message')
export const displayFailure  = createAction('[SignUp] Show Failure Message')

export const verifyingEmail = createAction('[SignUp] Verifying Email', props<Verify>())

export const verificationSuccess = createAction('[SignUp] Verification Success', props<VerifiedUser>())

export const verificationFailure = createAction('[SignUp] Verification Failure', props<VerificationFailure>())

