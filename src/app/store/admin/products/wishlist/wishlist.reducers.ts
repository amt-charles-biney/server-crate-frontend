import { createFeature, createReducer, on } from "@ngrx/store"
import { gotWishlist, removeFromWishlist, startLoader, updateUserProduct, wishlistUpdateFailure } from "../categories/categories.actions"
import { Wishlist } from "../../../../types"

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
      }),
      on(updateUserProduct, (state, { id }) => {
        const newContent = state.content.map((productItem) => {
          if (productItem.id === id) {
            return {
              ...productItem,
              isWishListItem: !productItem.isWishListItem,
              isLoading: false,
            };
          }
          return productItem;
        });
        return {
          ...state,
          content: newContent,
        };
      }),
      on(removeFromWishlist, (state, { id }) => {
        const newContent = state.content.filter((productItem) => productItem.id !== id);
        return {
          ...state,
          content: newContent
        }
      }),
      on(wishlistUpdateFailure, (state, { id }) => {
        const newContent = state.content.map((productItem) => {
          if (productItem.id === id) {
            return {
              ...productItem,
              isLoading: false,
            };
          }
          return productItem;
        });
        return {
          ...state,
          content: newContent,
        };
      }),
      on(startLoader, (state, { id }) => {
        const newContent = state.content.map((productItem) => {
          if (productItem.id === id) {
            return {
              ...productItem,
              isLoading: true,
            };
          }
          return productItem;
        });
  
        return {
          ...state,
          content: newContent,
        };
      })
    )
  })
  
  export const { selectContent, selectTotalElements, reducer } = wishlistFeature