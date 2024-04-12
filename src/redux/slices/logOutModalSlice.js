import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
};

const logOutModalSlice = createSlice({
    name: 'logOutModal',
    initialState,
    reducers:{
        openLogOutModal : (state, action) => {
            state.isOpen = true;
        },
        closeLogOutModal : (state, action) => {
            state.isOpen = false;
        },
    },
});

export const {openLogOutModal, closeLogOutModal} = logOutModalSlice.actions;

export default logOutModalSlice.reducer;