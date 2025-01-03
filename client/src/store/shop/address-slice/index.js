import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    addressList: [],
};


const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addNewAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addNewAddress.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(addNewAddress.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchAllAddresses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllAddresses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addressList = action.payload.data;
            })
            .addCase(fetchAllAddresses.rejected, (state) => {
                state.isLoading = false;
                state.addressList = [];
            });
    },
});

export const addNewAddress = createAsyncThunk(
    "/addresses/addNewAddress",
    async (formData) => {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/shop/address/add`,
            formData
        );
        console.log(response.data);
        
        return response.data;
    }
);

export const fetchAllAddresses = createAsyncThunk(
    "/addresses/fetchAllAddresses",
    async (userId) => {
        console.log();
        
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/shop/address/get/${userId}`
        );
        console.log("helo");
        
        return response.data;
    }
);

export const editAddress = createAsyncThunk(
    "/addresses/editaAddress",
    async ({ userId, addressId, formData }) => {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/shop/address/update/${userId}/${addressId}`,
            formData
        );
        return response.data;
    }
);

export const deleteAddress = createAsyncThunk(
    "/addresses/deleteAddress",
    async ({ userId, addressId }) => {
        const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/shop/address/delete/${userId}/${addressId}`
        );
        return response.data;
    }
);

export default addressSlice.reducer;
