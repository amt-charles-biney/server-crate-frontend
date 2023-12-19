import { createFeature, createReducer, on } from '@ngrx/store';
import { signIn, signInFailure, signInSuccess } from '../actions/login.actions';
import { initialState } from '../../signup/reducers/signup.reducers';


export const loginFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(signIn, (state, user) => ({
        ...state,
      isLoading: true,
      user: {
        ...state.user,
        email: user.email
      }
    })),
    on(signInSuccess, (state, user) => ({
      ...state,
      isLoading: false,
      isError: false,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token: user.token,
      message: 'Login Successful',
    })),
    on(signInFailure, (state, { errorMessage }) => ({
      ...state,
      isLoading: false,
      message: errorMessage,
      isError: true,
    })),
    
  ),
});

export const {
  name,
  reducer,
  selectAuthState,
  selectToken,
  selectUser
} = loginFeature