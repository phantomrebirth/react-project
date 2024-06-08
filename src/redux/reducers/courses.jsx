import {
  COURSES_START,
  COURSES_SUCCESS,
  COURSES_FAIL,
  COURSE_VIDEO_START,
  COURSE_VIDEO_SUCCESS,
  COURSE_VIDEO_FAIL,
  COURSE_FILE_START,
  COURSE_FILE_SUCCESS,
  COURSE_FILE_FAIL,
  COURSE_ASSIGNMENT_START,
  COURSE_ASSIGNMENT_SUCCESS,
  COURSE_ASSIGNMENT_FAIL,
  COURSE_PROJECT_START,
  COURSE_PROJECT_SUCCESS,
  COURSE_PROJECT_FAIL,
} from '../actions/type'

const initialState = {
  coursesData: [],
  courseVideoData: [],
  courseFileData: [],
  courseAssignmentData: [],
  courseProjectData: [],
  isLoading: false,
  fileIsLoading: false,
  videoIsLoading: false,
  assignmentIsLoading: false,
  projectIsLoading: false,
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case COURSE_PROJECT_START:
      return {
        ...state,
        projectIsLoading: true,
      }
    case COURSE_ASSIGNMENT_START:
      return {
        ...state,
        assignmentIsLoading: true,
      }
    case COURSE_FILE_START:
      return {
        ...state,
        fileIsLoading: true,
      };
    case COURSE_VIDEO_START:
      return {
        ...state,
        videoIsLoading: true,
      };
    case COURSES_START:
      return {
        ...state,
        isLoading: true,
      };
    case COURSE_FILE_SUCCESS:
      return {
        ...state,
        coursesFileData: payload,
        isLoading: false,
      };
    case COURSE_PROJECT_SUCCESS:
      return {
        ...state,
        coursesProjectData: payload,
        isLoading: false,
      };
    case COURSE_ASSIGNMENT_SUCCESS:
      return {
        ...state,
        coursesAssignmentData: payload,
        isLoading: false,
      };
    case COURSE_VIDEO_SUCCESS:
      return {
        ...state,
        courseVideoData: payload,
        isLoading: false,
      };
    case COURSES_SUCCESS:
      return {
        ...state,
        courseData: payload,
        isLoading: false,
      };
    case COURSE_VIDEO_FAIL:
    case COURSE_FILE_FAIL:
    case COURSE_ASSIGNMENT_FAIL:
    case COURSE_PROJECT_FAIL:
    case COURSES_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
    default:
      return state;
  }
};
