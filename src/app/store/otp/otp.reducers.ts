import { createFeature, createReducer, on } from '@ngrx/store';
import { SetOtp } from '../../types';
import { setOtp } from './otp.actions';
const initialState: SetOtp = {
  otp: '',
};

export const otpFeature = createFeature({
  name: 'otp',
  reducer: createReducer(
    initialState,
    on(setOtp, (state, { otp }) => ({ ...state, otp }))
  ),
});

export const { name, reducer, selectOtp, selectOtpState } = otpFeature;
