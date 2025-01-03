import  { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./auth-slice/index.js"
import adminProductSlice from "./admin/product-slice/index.js"
import adminOrderSlice from "./admin/order-slice/index.js"

import shoppingProductSlice from "./shop/product-slice/index.js"
import shopCartSlice from "./shop/cart-slice/index.js"
import commonFeatureSlice from "./common-slice/index.js"
import shopAddressSlice from "./shop/address-slice/index.js"
import shopOrderSlice from "./shop/order-slice/index.js"
import shopSearchSlice from "./shop/search-slice/index.js"
import shopReviewSlice from "./shop/review-slice/index.js"



const store = configureStore({
    reducer: {
        auth: authSliceReducer,

        adminProducts: adminProductSlice,
        adminOrder: adminOrderSlice,

        shopProducts: shoppingProductSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
        shopSearch: shopSearchSlice,
        shopReview: shopReviewSlice,

        commonFeature: commonFeatureSlice,
    }
})

export default store;