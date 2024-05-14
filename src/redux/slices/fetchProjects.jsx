// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { setSubmittedProjects } from './ProjectsSlice';

// const initialState = {
//     projects: [],
//     loading: false,
//     error: null,
// };

// // Define the thunk action creator using createAsyncThunk
// export const fetchProjects = createAsyncThunk(
//     'projects/fetchProjects',
//     async (_, { getState, dispatch }) => {
//         dispatch(setLoading(true));
//         try {
//             const currentCourseId = getState().courses.currentCourseId;
//             const course = getState().courses.find(course => course._id === currentCourseId);
//             if (!currentCourseId) throw new Error("No current course ID found");
            
//             const projectPath = course.projects.map(project => `https://ezlearn.onrender.com/course/getProjects/${currentCourseId}/${project._id}`);
//             const projectRequests = projectPath.map(project => fetch(project));
//             const responses = await Promise.all(projectRequests);
//             const buffers = await Promise.all(responses.map(response => response.arrayBuffer()));
            
//             const projects = course.projects.map((project, index) => ({
//                 ...project,
//                 _id: project._id,
//                 path: projectPath[index],
//                 buffer: buffers[index]
//             }));
            
//             dispatch(setSubmittedProjects(projects));
//             dispatch(setLoading(false));
//             return projects; // Return the projects array to be used by the fulfilled action
//         } catch (error) {
//             dispatch(setError(error.message));
//             dispatch(setLoading(false));
//             throw error; // Rethrow the error to be handled by the rejected action
//         }
//     }
// );

// // Define the slice
// const fetchedProjectsSlice = createSlice({
//     name: 'fetchedProjects',
//     initialState,
//     reducers: {
//         // Additional reducers if needed
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchProjects.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchProjects.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.projects = action.payload;
//             })
//             .addCase(fetchProjects.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message; // Access the error message from action.error
//             });
//     },
// });

// // Export the action creators and reducer
// export default fetchedProjectsSlice.reducer;