import { createSlice } from '@reduxjs/toolkit';

export const assignmentSlice = createSlice({
  name: 'assignment',
  initialState: {
    currentRoute: null,
  },
  reducers: {
    navigateToAssignment: (state) => {
      state.currentRoute = '/assignments';
    },
  },
});

export const { navigateToAssignment } = assignmentSlice.actions;

export default assignmentSlice.reducer;