import { createSlice } from '@reduxjs/toolkit';

export const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projectsPaths: {},
    submittedProjects: [],
  },
  reducers: {
    setProjectsPaths: (state, action) => {
      state.projectsPaths = action.payload;
    },
    setSubmittedProjects: (state, action) => {
      state.submittedProjects = action.payload;
    },
    updateProjectsPaths: (state, action) => {
        const { courseId, paths } = action.payload || {}; // Use default empty object to prevent destructuring error
        if (courseId && paths) {
          if (!state.projectsPaths[courseId]) {
            state.projectsPaths[courseId] = paths; // Initialize if courseId doesn't exist
          } else {
            state.projectsPaths[courseId] = { ...state.projectsPaths[courseId], ...paths }; // Merge paths if courseId already exists
          }
        }
    }
  },
});

export const { setProjectsPaths, setSubmittedProjects, updateProjectsPaths } = projectsSlice.actions;

export const selectSubmittedProjects = state => state.projects.submittedProjects;
export const selectProjectsPaths = state => state.projects.projectsPaths;

export default projectsSlice.reducer;