import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth, courses } = getState();
      const token = auth.token;
      const response = await axios.get('https://ezlearn.onrender.com/getCourse/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const fileIdArray = response.data.map(course => course.files.map(file => file._id)).flat();
      const assignmentIdArray = response.data.map(course => course.assignments.map(assignment => assignment._id)).flat();
      const courseIdArray = response.data.map(course => course._id);
      const courseNameArray = response.data.map(course => course.name);
            // Determine current course and file ID based on application state
            let currentCourseId = courses.currentCourseId;
            let currentFileId = courses.currentFileId;
            let currentAssignmentId = courses.currentAssignmentId;
            let currentCourseName = courses.currentCourseName;
            // console.log(currentCourseId,currentFileId);

      return { courses: response.data, fileIdArray, courseIdArray, assignmentIdArray, courseNameArray, currentCourseId, currentFileId, currentAssignmentId, currentCourseName };
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
    assignmentIdArray: [],
    courseNameArray: [],
    currentCourseId: null,
    currentFileId: null,
    currentAssignmentId: null,
    currentCourseName: null,
    loading: false,
    error: null
  },
  reducers: {
    setCurrentCourseId: (state, action) => {
      state.currentCourseId = action.payload;
    },
    setCurrentFileId: (state, action) => {
      state.currentFileId = action.payload;
    },
    setCurrentAssignmentId: (state, action) => {
      state.currentAssignmentId = action.payload;
    },
    setCurrentCourseName: (state, action) => {
      state.currentCourseName = action.payload;
    },
  },
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
        state.currentCourseId = action.payload.currentCourseId;
        state.currentFileId = action.payload.currentFileId;
        state.currentAssignmentId = action.payload.currentAssignmentId;
        state.currentCourseName = action.payload.currentCourseName;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const selectCourses = (state) => state.courses;
export const { setCurrentCourseId, setCurrentFileId, setCurrentAssignmentId, setCurrentCourseName } = coursesSlice.actions;

export default coursesSlice.reducer;