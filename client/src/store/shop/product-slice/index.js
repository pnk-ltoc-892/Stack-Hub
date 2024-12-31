import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"


const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null
}

const shoppingProductSlice = createSlice({
    name: 'shoppingProducts',
    initialState,
    reducers: {
        setProductDetails: (state) => {
            state.productDetails = null
        }

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
            .addCase(fetchProductDetails.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productDetails = action.payload.data;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.productDetails = null;
            });
    }
})


// Async Thunks
// Fetch All Products - Very Important Route & API call
export const fetchAllFilteredProducts = createAsyncThunk('/products/fetchAllProducts',
    async ({filterParams, sortParams}) => {
        const query = new URLSearchParams({
            ...filterParams,
            sortBy: sortParams
        })
        const response = await axios.get(`http://localhost:5000/api/v1/shop/products/get?${query}`,
            {}, {
            withCredentials: true
        })
        return response?.data
    }
)

export const fetchProductDetails = createAsyncThunk(
    "/products/fetchProductDetails",
    async (id) => {
        const result = await axios.get(
            `http://localhost:5000/api/v1/shop/products/get/${id}`
        );
        return result?.data;
    }
);
export const { setProductDetails } = shoppingProductSlice.actions

export default shoppingProductSlice.reducer