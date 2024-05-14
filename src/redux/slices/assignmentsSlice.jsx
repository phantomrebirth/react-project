import { createSlice } from '@reduxjs/toolkit';

export const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState: {
    assignmentsPaths: [],
    submittedAssignments: [],
    currentCourseId: null, // Add currentCourseId to the initial state
  },
  reducers: {
    setAssignmentsPaths: (state, action) => {
      state.assignmentsPaths = action.payload;
    },
    setSubmittedAssignments: (state, action) => {
      state.submittedAssignments = action.payload;
    },
    updateAssignmentsPaths: (state, action) => {
      const { currentCourseId, assignments } = action.payload;
      if (state.currentCourseId === currentCourseId) {
        state.assignmentsPaths = assignments;
      }
      state.currentCourseId = currentCourseId; // Update currentCourseId
    },
  },
});

export const { setAssignmentsPaths, setSubmittedAssignments, updateAssignmentsPaths } = assignmentsSlice.actions;

export const selectSubmittedAssignments = state => state.assignments.submittedAssignments;
export const selectAssignmentsPaths = state => state.assignments.assignmentsPaths;

export default assignmentsSlice.reducer;