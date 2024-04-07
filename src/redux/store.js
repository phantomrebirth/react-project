import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./slices/profileSlice";
import assignmentReducer from "./slices/assignmentSlice";
import croppedImageReducer from "./slices/croppedImageSlice";
import authReducer from "./slices/authSlice";
import imageUrlReducer from './slices/profilePictureSlice'

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        assignment: assignmentReducer,
        croppedImage: croppedImageReducer,
        auth: authReducer,
        profilePicture: imageUrlReducer,
    },
});