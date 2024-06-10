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
  SET_UPLOAD_ALERT,
  RESET_UPLOAD_ALERT,
  SET_DELETE_ALERT,
  RESET_DELETE_ALERT,
  SET_WAIT_ALERT,
  RESET_WAIT_ALERT,
  SET_CURRENT_COURSE_ID,
} from '../actions/type'

const initialState = {
  coursesData: [],
  courseVideoData: [],
  courseFileData: [],
  courseAssignmentData: [],
  courseProjectData: [],
  submittedAssignments: [], // Initialize submittedAssignments as an empty array
  currentCourseID: null,
  isLoading: false,
  fileIsLoading: false,
  videoIsLoading: false,
  assignmentIsLoading: false,
  projectIsLoading: false,
  uploadAlert: null,
  deleteAlert: null,
  waitAlert: null,
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_CURRENT_COURSE_ID:
      return {
        ...state,
        currentCourseID: action.payload,
      };
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
        courseFileData: payload,
        fileIsLoading: false,
      };
    case COURSE_PROJECT_SUCCESS:
      return {
        ...state,
        courseProjectData: payload,
        projectIsLoading: false,
      };
    case COURSE_ASSIGNMENT_SUCCESS:
      return {
        ...state,
        courseAssignmentData: [payload],
        assignmentIsLoading: false,
      };
    case COURSE_VIDEO_SUCCESS:
      return {
        ...state,
        courseVideoData: payload,
        videoIsLoading: false,
      };
    case COURSES_SUCCESS:
      return {
        ...state,
        coursesData: payload,
        isLoading: false,
      };
    case COURSE_VIDEO_FAIL:
    case COURSE_FILE_FAIL:
    case COURSE_ASSIGNMENT_FAIL:
    case COURSE_PROJECT_FAIL:
    case COURSES_FAIL:
      return {
        ...state,
        projectIsLoading: false,
        assignmentIsLoading: false,
        fileIsLoading: false,
        videoIsLoading: false,
        isLoading: false,
        error: payload,
      };
        case SET_UPLOAD_ALERT:
      return {
        ...state,
        uploadAlert: payload,
        waitAlert: null,
      };
    case RESET_UPLOAD_ALERT:
      return {
        ...state,
        uploadAlert: null,
      };
    case SET_DELETE_ALERT:
      return {
        ...state,
        deleteAlert: payload,
        waitAlert: null,
      };
    case RESET_DELETE_ALERT:
      return {
        ...state,
        deleteAlert: null,
      };
    case SET_WAIT_ALERT:
      return {
        ...state,
        waitAlert: payload,
      };
    case RESET_WAIT_ALERT:
      return {
        ...state,
        waitAlert: null,
      };
    default:
      return state;
  }
};
