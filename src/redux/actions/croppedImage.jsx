import { SET_CROPPED_IMAGE_NAME } from "./type";

export const setCroppedImageName = (croppedImageName) => ({
    type: SET_CROPPED_IMAGE_NAME,
    payload: croppedImageName,
});