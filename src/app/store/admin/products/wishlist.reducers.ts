import { createFeature, createReducer, on } from "@ngrx/store"
import { gotWishlist } from "./categories.actions"
import { Wishlist } from "../../../types"

const wishlistState: Wishlist = {
    content: [],
    size: 0,
    totalElements: 0,
    totalPages: 0
  }
  
  export const wishlistFeature = createFeature({
    name: 'wishlist',
    reducer: createReducer(
      wishlistState,
      on(gotWishlist, (state, props) => {
        return {
          ...state,
          ...props
        }
      })
    )
  })
  
  export const { selectContent, selectTotalElements } = wishlistFeature