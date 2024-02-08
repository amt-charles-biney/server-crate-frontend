import { createFeature, createReducer, on } from "@ngrx/store";
import { CartProductItem, CartResponse } from "../../types";
import { gotCartItems } from "./cart.actions";

const cartState: CartResponse = {
    configuredProducts: [],
    count: 0
}
export const cartFeature = createFeature({
    name: 'cart',
    reducer: createReducer(
        cartState,
        on(gotCartItems, (state, { configuredProducts, count}) => {
            return {
                ...state,
                configuredProducts,
                count
            }
        })
    )
})

export const { selectCartState, selectConfiguredProducts, selectCount } = cartFeature