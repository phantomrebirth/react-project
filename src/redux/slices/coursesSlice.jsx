import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const response = await axios.get('https://ezlearn.onrender.com/getCourse/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const fileIdArray = response.data.map(course => course.files.map(file => file._id)).flat();
      const courseIdArray = response.data.map(course => course._id);

      return { courses: response.data, fileIdArray, courseIdArray };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    data: [],
    fileIdArray: [],
    courseIdArray: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.courses;
        state.fileIdArray = action.payload.fileIdArray;
        state.courseIdArray = action.payload.courseIdArray;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const selectCourses = (state) => state.courses;

export default coursesSlice.reducer;