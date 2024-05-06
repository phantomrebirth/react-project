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
      const courseIdArray = response.data.map(course => course._id);
      const courseNameArray = response.data.map(course => course.name);
      const fileIdArray = response.data.map(course => course.files.map(file => file._id)).flat();
      const assignmentIdArray = response.data.map(course => course.assignments.map(assignment => assignment._id)).flat();
      const projectIdArray = response.data.map(course => course.projects.map(project => project._id)).flat();
      const videoIdArray = response.data.map(course => course.videos.map(video => video._id)).flat();
            // Determine current course and file ID based on application state
            let currentCourseId = courses.currentCourseId;
            let currentCourseName = courses.currentCourseName;
            let currentFileId = courses.currentFileId;
            let currentAssignmentId = courses.currentAssignmentId;
            let currentProjectId = courses.currentProjectId;
            let currentVideoId = courses.currentVideoId;
            // console.log(currentCourseId,currentFileId);
            return { courses: response.data,
                              courseIdArray,
                              currentCourseId,
                              courseNameArray,
                              currentCourseName,
                              videoIdArray,
                              currentVideoId,
                              fileIdArray,
                              currentFileId,
                              assignmentIdArray,
                              currentAssignmentId,
                              projectIdArray,
                              currentProjectId, };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    loading: false,
    data: [],
    courseIdArray: [],
    currentCourseId: null,
    courseNameArray: [],
    currentCourseName: null,
    videoIdArray: [],
    currentVideoId: null,
    fileIdArray: [],
    currentFileId: null,
    assignmentIdArray: [],
    currentAssignmentId: null,
    projectIdArray: [],
    currentProjectId: null,
    error: null
  },
  reducers: {
    setCurrentCourseId: (state, action) => {
      state.currentCourseId = action.payload;
    },
    setCurrentCourseName: (state, action) => {
      state.currentCourseName = action.payload;
    },
    setCurrentFileId: (state, action) => {
      state.currentFileId = action.payload;
    },
    setCurrentAssignmentId: (state, action) => {
      state.currentAssignmentId = action.payload;
    },
    setCurrentProjectId: (state, action) => {
      state.currentProjectId = action.payload;
    },
    setCurrentVideoId: (state, action) => {
      state.currentVideoId = action.payload;
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
        state.courseIdArray = action.payload.courseIdArray;
        state.currentCourseId = action.payload.currentCourseId;
        state.currentCourseName = action.payload.currentCourseName;
        state.fileIdArray = action.payload.fileIdArray;
        state.currentFileId = action.payload.currentFileId;
        state.assignmentIdArray = action.payload.assignmentIdArray;
        state.currentAssignmentId = action.payload.currentAssignmentId;
        state.projectIdArray = action.payload.projectIdArray;
        state.currentProjectId = action.payload.currentProjectId;
        state.videoIdArray = action.payload.videoIdArray;
        state.currentVideoId = action.payload.currentVideoId;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const selectCourses = (state) => state.courses;
export const { setCurrentCourseId, setCurrentCourseName, setCurrentFileId, setCurrentAssignmentId, setCurrentProjectId, setCurrentVideoId } = coursesSlice.actions;

export default coursesSlice.reducer;