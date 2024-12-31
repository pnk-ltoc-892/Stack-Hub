import  { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./auth-slice/index.js"
import adminProductSlice from "./admin/product-slice/index.js"
import shoppingProductSlice from "./shop/product-slice/index.js"
import shopCartSlice from "./shop/cart-slice/index.js"
import commonFeatureSlice from "./common-slice/index.js"
import shopAddressSlice from "./shop/address-slice/index.js"


const store = configureStore({
    reducer: {
        auth: authSliceReducer,

        adminProducts: adminProductSlice,

        shopProducts: shoppingProductSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,

        commonFeature: commonFeatureSlice,
    }
})

export default store;