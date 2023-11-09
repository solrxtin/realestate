import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    loading: false,
    error: null,
    success: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signUpSuccess: (state, action) => {
            state.success = action.payload.message
        },
        signUpSuccessAlt: (state, action) => {
            state.success = null
        },
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload,
            state.loading =  false,
            state.error = null
        },
        signInFailure: (state, action) => {
            state.error = action.payload,
            state.loading = false
        },
        signInFailureAlt: (state) => {
            state.error = null,
            state.loading = false
        },
        signOutStart: (state) => {
            state.loading = true
        },
        signOutFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        signOutSuccess: (state, action) => {
            state.currentUser = null
            state.error = null
            state.loading = false
            state.success = action.payload.message
        },
        signOutSuccessAlt: (state) => {
            state.success = null
        },
        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload,
            state.loading =  false,
            state.error = null
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload,
            state.loading = false
        },
        deleteUserStart: (state) => {
            state.loading = true
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        deleteUserSuccess: (state, action) => {
            state.currentUser = null,
            state.loading = false,
            state.error = null,
            state.message = action.payload.message
        }
    }
})

export const {
    updateUserStart, 
    updateUserSuccess, 
    updateUserFailure,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signInStart, 
    signInFailure, 
    signInSuccess, 
    signOutFailure, 
    signOutStart, 
    signOutSuccess,
    signUpSuccess,
    signUpSuccessAlt,
    signOutSuccessAlt,
    signInFailureAlt
} = userSlice.actions

export default userSlice.reducer