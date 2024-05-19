// import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const fetchCourses = createAsyncThunk(
//   'courses/fetchCourses',
//   async (_, { rejectWithValue, getState, dispatch }) => {
//     try {
//       dispatch(setCoursesLoading(true)); // Dispatch the action to set courses loading to true
//       const { auth, courses } = getState();
//       const token = auth.token;
//       const response = await axios.get('https://ezlearn.onrender.com/getCourse/all', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       dispatch(setCoursesLoading(false)); // Reset loading flag for cours
//       const courseIdArray = response.data.map(course => course._id);
//       const courseNameArray = response.data.map(course => course.name);
//       const fileIdArray = response.data.map(course => course.files.map(file => file._id)).flat();
//       const assignmentIdArray = response.data.map(course => course.assignments.map(assignment => assignment._id)).flat();
//       const projectIdArray = response.data.map(course => course.projects.map(project => project._id)).flat();
//       const videoIdArray = response.data.map(course => course.videos.map(video => video._id)).flat();
//             // Determine current course and file ID based on application state
//             let currentCourseId = courses.currentCourseId;
//             let currentCourseName = courses.currentCourseName;
//             let currentFileId = courses.currentFileId;
//             let currentAssignmentId = courses.currentAssignmentId;
//             let currentProjectId = courses.currentProjectId;
//             let currentVideoId = courses.currentVideoId;
//             // console.log(currentCourseId,currentFileId);
//             return { courses: response.data,
//                                       courseIdArray,
//                                       currentCourseId,
//                                       courseNameArray,
//                                       currentCourseName,
//                                       videoIdArray,
//                                       currentVideoId,
//                                       fileIdArray,
//                                       currentFileId,
//                                       assignmentIdArray,
//                                       currentAssignmentId,
//                                       projectIdArray,
//                                       currentProjectId,
//                     };
//     } catch (error) {
//       dispatch(setCoursesLoading(false));
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const setUploadAlert = createAction('courses/setUploadAlert');
// export const resetUploadAlert = createAction('courses/resetUploadAlert');
// export const setDeleteAlert = createAction('courses/setDeleteAlert');
// export const resetDeleteAlert = createAction('courses/resetDeleteAlert');
// export const setWaitAlert = createAction('courses/setWaitAlert');
// export const resetWaitAlert = createAction('courses/resetWaitAlert');

// const coursesSlice = createSlice({
//   name: 'courses',
//   initialState: {
//     coursesLoading: false,
//     filesLoading: false,
//     assignmentsLoading: false,
//     projectsLoading: false,
//     videosLoading: false,
//     deleteAlert: null,
//     uploadAlert: null,
//     waitAlert: null,
//     data: [],
//     courseIdArray: [],
//     currentCourseId: null,
//     courseNameArray: [],
//     currentCourseName: null,
//     videoIdArray: [],
//     currentVideoId: null,
//     fileIdArray: [],
//     currentFileId: null,
//     assignmentIdArray: [],
//     currentAssignmentId: null,
//     projectIdArray: [],
//     currentProjectId: null,
//     error: null
//   },
//   reducers: {
//     setCoursesLoading: (state, action) => {
//       state.coursesLoading = action.payload;
//     },
//     setFilesLoading: (state, action) => {
//       state.filesLoading = action.payload;
//     },
//     setAssignmentsLoading: (state, action) => {
//       state.assignmentsLoading = action.payload;
//     },
//     setProjectsLoading: (state, action) => {
//       state.projectsLoading = action.payload;
//     },
//     setVideosLoading: (state, action) => {
//       state.videosLoading = action.payload;
//     },
//     setCurrentCourseId: (state, action) => {
//       state.currentCourseId = action.payload;
//     },
//     setCurrentCourseName: (state, action) => {
//       state.currentCourseName = action.payload;
//     },
//     setCurrentFileId: (state, action) => {
//       state.currentFileId = action.payload;
//     },
//     setCurrentAssignmentId: (state, action) => {
//       state.currentAssignmentId = action.payload;
//     },
//     setCurrentProjectId: (state, action) => {
//       state.currentProjectId = action.payload;
//     },
//     setCurrentVideoId: (state, action) => {
//       state.currentVideoId = action.payload;
//     },
//     setUploadAlert: (state, action) => {
//       state.uploadAlert = action.payload;
//       state.waitAlert = null;
//     },
//     resetUploadAlert: (state) => {
//       state.uploadAlert = null;
//     },
//     setDeleteAlert: (state, action) => {
//       state.deleteAlert = action.payload;
//       state.waitAlert = null;
//     },
//     resetDeleteAlert: (state) => {
//       state.deleteAlert = null;
//     },
//     setWaitAlert: (state, action) => {
//       state.waitAlert = action.payload;
//     },
//     resetWaitAlert: (state) => {
//       state.waitAlert = null;
//     },
//     addFile: (state, action) => {
//       const { courseId, file } = action.payload;
//       const course = state.data.find(course => course._id === courseId);
//       if (course) {
//         course.files.push(file);
//       }
//     },
//     deleteFile: (state, action) => {
//       const { courseId, fileId } = action.payload;
//       const course = state.data.find(course => course._id === courseId);
//       if (course) {
//         course.files = course.files.filter(file => file._id !== fileId);
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCourses.pending, (state) => {
//         state.fetchingData = true;
//         state.error = null;
//       })
//       .addCase(fetchCourses.fulfilled, (state, action) => {
//         state.fetchingData = false;
//         state.processingData = true;
//         state.data = action.payload.courses;
//         state.courseIdArray = action.payload.courseIdArray;
//         state.currentCourseId = action.payload.currentCourseId;
//         state.currentCourseName = action.payload.currentCourseName;
//         state.fileIdArray = action.payload.fileIdArray;
//         state.currentFileId = action.payload.currentFileId;
//         state.assignmentIdArray = action.payload.assignmentIdArray;
//         state.currentAssignmentId = action.payload.currentAssignmentId;
//         state.projectIdArray = action.payload.projectIdArray;
//         state.currentProjectId = action.payload.currentProjectId;
//         state.videoIdArray = action.payload.videoIdArray;
//         state.currentVideoId = action.payload.currentVideoId;
//         state.processingData = false;
//       })
//       .addCase(fetchCourses.rejected, (state, action) => {
//         state.fetchingData = false;
//         state.processingData = false;
//         state.error = action.payload;
//       });
//   }
// });

// export const selectCourses = (state) => state.courses;
// export const { setCoursesLoading, setFilesLoading, setAssignmentsLoading, setProjectsLoading, setVideosLoading, setCurrentCourseId, setCurrentCourseName, setCurrentFileId, setCurrentAssignmentId, setCurrentProjectId, setCurrentVideoId } = coursesSlice.actions;

// export default coursesSlice.reducer;