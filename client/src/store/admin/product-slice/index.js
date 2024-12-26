import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const AdminProductSlice = createSlice({
    name: 'adminproduct',
    initialState: {
        isLoading: false,
        productList: [],
        // ! Add 'Error' And Some More Useful States Here
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProducts.pending, (state, action) => {
                state.isLoading = true;
            })
            // ! See How Scroll Pagination is Done
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productList = action.payload.data;
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.productList = [];
            })
    }


})


// Async Thunks

// Add New Product
export const addNewProduct = createAsyncThunk('product/addNewProduct',
    async (formData) => {
        const response = await axios.post(
            "http://localhost:5000/api/v1/admin/products/add",
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    }
)

// Edit a Product
export const editProduct = createAsyncThunk(
    "/products/editProduct",
    async ({ id, formData }) => {
        const result = await axios.put(
            `http://localhost:5000/api/v1/admin/products/edit/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return result?.data;
    }
);

// Delete a Product
export const deleteProduct = createAsyncThunk(
    "/products/deleteProduct",
    async (id) => {
        const result = await axios.delete(
            `http://localhost:5000/api/v1/admin/products/delete/${id}`
        );
        return result?.data;
    }
);

// Fetch All Products
export const fetchAllProducts = createAsyncThunk(
    "/products/fetchAllProducts",
    async () => {
        const result = await axios.get(
            "http://localhost:5000/api/v1/admin/products/"
        );
        return result?.data;
    }
);


export default AdminProductSlice.reducer;