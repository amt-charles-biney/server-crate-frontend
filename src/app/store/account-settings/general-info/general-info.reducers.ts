import { GeneralInfo } from '../../../types';
import { createFeature, createReducer, on } from '@ngrx/store';
import { gotGeneralInfo } from './general-info.actions';

const initialState: GeneralInfo = {
  firstName: '',
  contact: {
    country: '',
    dialCode: '',
    iso2Code: '',
    phoneNumber: '',
  },
  email: '',
  lastName: '',
};
export const generalInfoFeature = createFeature({
  name: 'generalInfo',
  reducer: createReducer(
    initialState,
    on(gotGeneralInfo, (state, { lastName, contact, email, firstName }) => ({
      firstName,
      lastName,
      email,
      contact
    }))
  ),
});

export const {
  reducer,
  name,
  selectContact,
  selectEmail,
  selectFirstName,
  selectLastName,
  selectGeneralInfoState,
} = generalInfoFeature;
