import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./slices/profileSlice";
import assignmentReducer from "./slices/assignmentSlice";
import croppedImageReducer from "./slices/croppedImageSlice";

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        assignment: assignmentReducer,
        croppedImage: croppedImageReducer,
    },
});