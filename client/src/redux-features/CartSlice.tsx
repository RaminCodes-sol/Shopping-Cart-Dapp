import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ProductType } from "../types"


type CartItemType = {
    amount: number,
    item: ProductType
}

type InitialStateType = {
    cartItems: CartItemType[],
    products: ProductType[],
    searchedItems: ProductType[]
}


const initialState: InitialStateType = {
    cartItems: [],
    products: [],
    searchedItems: []
}


const cartSlice = createSlice({
    name: 'shoppingCart',
    initialState,
    reducers: {

        SET_PRODUCTS: (state, { payload }: PayloadAction<ProductType[]>) => {
            state.products = payload
        },

        SET_SEARCHED_ITEMS: (state, { payload }: PayloadAction<ProductType[]>) => {
            state.searchedItems = payload
        },

        ADD_TO_CART: (state, { payload }: PayloadAction<ProductType>) => {
            state.cartItems = [{ amount: 1, item: payload }, ...state.cartItems]
        },

        REMOVE_FROM_CART: (state, { payload }: PayloadAction<number>) => {
            state.cartItems = state.cartItems.filter(item => Number(item.item.id) !== payload)
        },

        INCREASE_AMOUNT: (state, { payload }: PayloadAction<number>) => {
            state.cartItems = state.cartItems.map(item => {
                if (Number(item.item.id) === payload) {
                    return {
                        ...item,
                        amount: item.amount >= Number(item.item.stock) ? item.amount : item.amount + 1 
                    }
                }
                return item
            })
        },

        DECREASE_AMOUNT: (state, { payload }: PayloadAction<number>) => {
            state.cartItems = state.cartItems.map(item => {
                if (Number(item.item.id) === payload) {
                    return {
                        ...item,
                        amount: item.amount > 1 ? item.amount - 1 : 1
                    }
                }
                return item
            })
        }
    }
})

export const { SET_PRODUCTS, SET_SEARCHED_ITEMS, ADD_TO_CART, REMOVE_FROM_CART, INCREASE_AMOUNT, DECREASE_AMOUNT } = cartSlice.actions
export default cartSlice.reducer