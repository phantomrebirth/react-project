// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const fetchProfilePicture = createAsyncThunk(
//   'profilePicture/fetchProfilePicture',
//   async (token, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await axios.get('https://ezlearn.onrender.com/users/getPP', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         responseType: 'blob'
//       });
//       const imageUrl = URL.createObjectURL(response.data);
//       return imageUrl;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const initialState = {
//   imageUrl: null,
//   isLoading: false,
//   error: null,
// };

// const profilePictureSlice = createSlice({
//   name: 'profilePicture',
//   initialState,
//   reducers: {
//     setImageUrl: (state, action) => {
//       state.imageUrl = action.payload;
//     },
//     setLoading: (state, action) => {
//       state.isLoading = action.payload;
//     },
//     setError: (state, action) => {
//       state.error = action.payload;
//     },
//   },
//     extraReducers: (builder) => {
//       builder
//         .addCase(fetchProfilePicture.pending, (state) => {
//           state.isLoading = true;
//           state.error = null;
//         })
//         .addCase(fetchProfilePicture.fulfilled, (state, action) => {
//           state.isLoading = false;
//           state.imageUrl = action.payload;
//         })
//         .addCase(fetchProfilePicture.rejected, (state, action) => {
//           state.isLoading = false;
//           state.error = action.payload;
//         });
//     },
// });

// export const selectImageUrl = (state) => state.profilePicture.imageUrl;
// export const selectIsLoading = (state) => state.profilePicture.isLoading;
// export const selectError = (state) => state.profilePicture.error;

// export const { setImageUrl, setLoading, setError } = profilePictureSlice.actions;
// export default profilePictureSlice.reducer;