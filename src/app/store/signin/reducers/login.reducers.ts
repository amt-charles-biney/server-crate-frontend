import { createFeature, createReducer, on } from '@ngrx/store';
import { signIn, signInSuccess } from '../actions/login.actions';
import { initialState } from '../../signup/reducers/signup.reducers';

export const loginFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(signIn, (state, user) => ({
      ...state,
      user: {
        ...state.user,
        email: user.email,
      },
    })),
    on(signInSuccess, (state, user) => ({
      ...state,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token: user.token,
    }))
  ),
});

export const { name, reducer, selectAuthState, selectToken, selectUser } =
  loginFeature;
