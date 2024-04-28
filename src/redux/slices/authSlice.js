// import { createSlice } from '@reduxjs/toolkit';

// // retrieve token from localStorage if it exists
// const tokenFromStorage = localStorage.getItem('token');

// const initialState = {
//   token: tokenFromStorage ? tokenFromStorage : null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setToken(state, action) {
//       state.token = action.payload;
//       localStorage.setItem('token', action.payload);
//     },
//     clearToken(state) {
//       state.token = null;
//       localStorage.removeItem('token');
//     },
//   },
// });

// export const selectToken = (state) => state.auth.token;

// export const { setToken, clearToken } = authSlice.actions;
// export default authSlice.reducer;
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://ezlearn.onrender.com/users/login', { email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// retrieve token from localStorage if it exists
const tokenFromStorage = localStorage.getItem('token');
const roleFromStorage = localStorage.getItem('role');

const initialState = {
  token: tokenFromStorage ? tokenFromStorage : null,
  role: roleFromStorage ? roleFromStorage : null,
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
    setRole(state, action) {
      state.role = action.payload;
      localStorage.setItem('role', action.payload);
    },
    clearRole(state) {
      state.role = null;
      localStorage.removeItem('role');
    },
  },
});

export const selectToken = (state) => state.auth.token;
export const selectRole = (state) => state.auth.role;

export const { setToken, clearToken, setRole, clearRole } = authSlice.actions;
export default authSlice.reducer;