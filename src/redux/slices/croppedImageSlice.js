// croppedImageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  croppedImageName: '',
};

const croppedImageSlice = createSlice({
  name: 'croppedImage',
  initialState,
  reducers: {
    setCroppedImageName(state, action) {
      state.croppedImageName = action.payload;
    },
  },
});

export const { setCroppedImageName } = croppedImageSlice.actions;

export default croppedImageSlice.reducer;