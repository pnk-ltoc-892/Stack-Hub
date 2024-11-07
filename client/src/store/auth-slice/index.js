import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"


const initialState = {
    isAuthenticated: false,
    isLoading: true,    // ! true - Initially
    user: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
        }
    },
    extraReducers: (builder) => {
        builder
        // Register
        .addCase(registerUser.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.user = null
            state.isAuthenticated = false
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false
            state.user = null
            state.isAuthenticated = false
        })
        // Login
        .addCase(loginUser.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            // console.log(action);
            // ! Set Data Only When Login Is Succesfull
            state.isLoading = false
            state.user = action?.payload?.success ? action?.payload?.user : null
            // console.log(state.user);
            state.isAuthenticated = action?.payload?.success ? true : false
            // Mistakes, if login not succesfull, yhen fir ??? - Solved
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false
            state.user = null
            state.isAuthenticated = false
        })
        // Check Authentication
        .addCase(checkAuth.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(checkAuth.fulfilled, (state, action) => {
            // console.log(action);
            // ! Set Data Only When Login Is Succesfull
            state.isLoading = false
            state.user = action?.payload?.success ? action?.payload?.user : null
            // console.log(state.user);
            state.isAuthenticated = action?.payload?.success
        })
        .addCase(checkAuth.rejected, (state, action) => {
            state.isLoading = false
            state.user = null
            state.isAuthenticated = false
        })
    }
})


// Async Thunks
// Register
export const registerUser = createAsyncThunk('/auth/register', 
    async (formData) => {
        const response = await axios.post('http://localhost:5000/api/v1/user/register', formData, {
            withCredentials: true
        })
        return response.data
    }
)
// Login
export const loginUser = createAsyncThunk('/auth/login',  // Identifier
    async (formData) => {
        const response = await axios.post('http://localhost:5000/api/v1/user/login', formData, {
            withCredentials: true
        })
        return response.data
    }
)
// Check-Auth
export const checkAuth = createAsyncThunk('/auth/check-auth',  // Identifier
    async () => {
        const response = await axios.get('http://localhost:5000/api/v1/user/check-auth',
        {
            withCredentials: true,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                Expires: '0'
            }
        })
        return response.data
    }
)



export const { setUser } = authSlice.actions

export default authSlice.reducer