import { createSlice } from '@reduxjs/toolkit';

// retrieve token from localStorage if it exists
const tokenFromStorage = localStorage.getItem('token');

const initialState = {
  token: tokenFromStorage ? tokenFromStorage : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const selectToken = (state) => state.auth.token;

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;