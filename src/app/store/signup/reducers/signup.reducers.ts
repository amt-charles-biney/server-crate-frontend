import { UserSignUp } from './../../../types';
import { createFeature, createReducer, on } from '@ngrx/store';
import { AppState } from '../../../types';
import * as SignUpActions from '../actions/signup.actions';

export const initialState: AppState = {
  isLoading: false,
  isError: false,
  message: '',
  user: {
    firstName: '',
    lastName: '',
    email: '',
  },
  token: '',
};
export const signUpFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(SignUpActions.signUp, (state, user) => ({
      ...state,
      isLoading: true,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
    })),
    on(SignUpActions.signUpSuccess, (state) => ({
      ...state,
      isLoading: false,
      isError: false,
      message: 'OTP has been sent to your email. Please verify your email',
    })),
    on(SignUpActions.reset, (state) => ({
      ...state,
      isLoading: false,
      isError: false,
      message: '',
    })),
    on(SignUpActions.signUpFailure, (state, { errorMessage }) => ({
      ...state,
      isLoading: false,
      message: errorMessage,
      isError: true,
    })),
    on(SignUpActions.verifyingEmail, (state) => ({
      ...state,
      isLoading: true,
      isError: false,
    })),
    on(SignUpActions.verificationSuccess, (state, { firstName, email, lastName, token }) => ({
      ...state,
      isLoading: false,
      message: 'Email successfully verified',
      user: {
        ...state.user,
        firstName,
        email,
        lastName
      },
      token
    })),
    on(SignUpActions.verificationFailure, (state, { errorMessage }) => ({
      ...state,
      isLoading: false,
      message: errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1),
      isError: true,
    }))
  ),
});

export const {
  name,
  reducer,
  selectMessage,
  selectIsLoading,
  selectIsError,
  selectAuthState,
  selectToken,
  selectUser,
} = signUpFeature;
