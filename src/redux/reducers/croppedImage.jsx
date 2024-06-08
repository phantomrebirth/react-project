import { SET_CROPPED_IMAGE_NAME } from "../actions/type";

const initialState = {
    croppedImageName: '',
};

export const croppedImageReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_CROPPED_IMAGE_NAME:
        return {
          ...state,
          croppedImageName: action.payload,
        };
      default:
        return state;
    }
};

export const selectCroppedImageName = (state) => state.croppedImage.croppedImageName;