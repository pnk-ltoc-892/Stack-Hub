import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"


const initialState = {
    isLoading: false,  
    productList: []
}

const shoppingProductSlice = createSlice({
    name: 'shoppingProducts',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
        // Register
        .addCase(fetchAllFilteredProducts.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
            state.isLoading = false
            state.productList = action.payload.data
        })
        .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
            state.isLoading = false
            state.productList = []
        })
    }
})


// Async Thunks
// Fetch All Products
export const fetchAllFilteredProducts = createAsyncThunk('/products/fetchAllProducts', 
    async () => {
        const response = await axios.get('http://localhost:5000/api/v1/shop/products/get',
            {}, {
            withCredentials: true
        })
        return response?.data
    }
)

export default shoppingProductSlice.reducer