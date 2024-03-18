import { CreditCard, GeneralInfo, MobileMoneyWallet, ShippingPayload } from '../../../types';
import { createFeature, createReducer, on } from '@ngrx/store';
import { gotCards, gotGeneralInfo, gotMomoWallet, gotShippingDetails } from './general-info.actions';

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
  role: '',
};
export const generalInfoFeature = createFeature({
  name: 'generalInfo',
  reducer: createReducer(
    initialState,
    on(
      gotGeneralInfo,
      (state, { lastName, contact, email, firstName, role }) => ({
        firstName,
        lastName,
        email,
        contact,
        role,
      })
    )
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

const shippingDetailsInitialState: ShippingPayload = {
  address1: '',
  address2: '',
  city: '',
  country: '',
  firstName: '',
  lastName: '',
  state: '',
  zipCode: '',
  contact: null,
  email: ''
};
export const shippingFeature = createFeature({
  name: 'shippingDetails',
  reducer: createReducer(
    shippingDetailsInitialState,
    on(
      gotShippingDetails,
      (
        _,
        {
          address1,
          address2,
          city,
          country,
          firstName,
          lastName,
          state,
          zipCode,
          contact,
          email,
        }
      ) => {
        return {
          address1,
          address2,
          city,
          country,
          firstName,
          lastName,
          state,
          zipCode,
          contact,
          email
        };
      }
    )
  ),
});

export const { selectShippingDetailsState } = shippingFeature;


const paymentState: { wallets: MobileMoneyWallet[], creditCards: CreditCard[] } = {
  wallets: [],
  creditCards: []
}


export const paymentFeature = createFeature({
  name: 'payment',
  reducer: createReducer(
    paymentState,
    on(gotMomoWallet, (state, {wallets}) => {            
      return {
        ...state,
        wallets,
      }
    }),
    on(gotCards, (state, { creditCards }) => {
      return {
        ...state,
        creditCards
      }
    })
  )
})

export const { selectWallets, selectCreditCards } = paymentFeature