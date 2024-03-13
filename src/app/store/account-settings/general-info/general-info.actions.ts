import { UserInfo, GeneralInfo, ShippingPayload, MobileMoneyWallet, CreditCard } from './../../../types';
import { createAction, props } from "@ngrx/store";

export const getGeneralInfo = createAction('[general info] get info')

export const gotGeneralInfo = createAction('[general info] got info successfully', props<GeneralInfo>())

export const changeUserInfo = createAction('[general info] changing contact', props<UserInfo>())

export const saveShippingDetails = createAction('[shipping] save shipping', props<ShippingPayload>())

export const getShippingDetails = createAction('[shipping] get shipping details')

export const gotShippingDetails = createAction('[shipping] got shipping details', props<ShippingPayload>())

export const addMomoWallet = createAction('[payment] add momo wallet', props<MobileMoneyWallet>())
export const deletePaymentInfo = createAction('[payment] delete payment info', props<{id: string}>())
export const getMomoWallet = createAction('[payment] get momo wallet')
export const gotMomoWallet = createAction('[payment] got momo wallet', props<{wallets: MobileMoneyWallet[]}>())

export const addCard = createAction('[payment] add credit card', props<CreditCard>())
export const getCards = createAction('[payment] get credit cards')
export const gotCards = createAction('[payment] got credit cards', props<{creditCards: CreditCard[]}>())