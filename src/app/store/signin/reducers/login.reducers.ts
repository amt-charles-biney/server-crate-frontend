import { createFeature, createReducer, on } from '@ngrx/store';
import { signIn, signInFailure, signInSuccess } from '../actions/login.actions';
import { initialState } from '../../signup/reducers/signup.reducers';

export const loginFeature = createFeature({
  name: 'login',
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
      user,
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

