import { createAction, props } from "@ngrx/store";
import { SignIn, AuthFailure, VerifiedUser } from "../../../types";


export const signIn = createAction('[SignIn] User SignIn', props<SignIn>())


export const signInSuccess = createAction('[SignIn] SignIn Success', props<VerifiedUser>())


export const signInFailure = createAction('[SignIn] SignIn Failure', props<AuthFailure>())