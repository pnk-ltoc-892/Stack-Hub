import  { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./auth-slice/index.js"
import adminProductSlice from "./admin/product-slice/index.js"


const store = configureStore({
    reducer: {
        auth: authSliceReducer,

        adminProducts: adminProductSlice
    }
})

export default store;