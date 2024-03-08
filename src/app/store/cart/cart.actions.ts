import { CartProductItem, CartQuantity, CartResponse } from './../../types';
import { createAction, props } from "@ngrx/store";

export const getCartItems = createAction('[Cart] get cart items')
export const gotCartItems = createAction('[Cart] got cart items', props<CartResponse>())

export const deleteCartItem = createAction('[Cart] delete cart item', props<{ id: string }>())

export const increaseQuantity = createAction('[Cart] increase quantity', props<CartQuantity>())
export const decreaseQuantity = createAction('[Cart] decrease quantity', props<CartQuantity>())