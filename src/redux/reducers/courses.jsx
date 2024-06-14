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
  SET_FILES_WITH_PATHS,
  START_FILE_OPERATION,
  FINISH_FILE_OPERATION,
  SET_WAIT_VIDEO_ALERT,
  RESET_WAIT_VIDEO_ALERT,
} from '../actions/type'

const initialState = {
  coursesData: [],
  courseVideoData: [],
  courseFileData: [],
  filesWithPaths: [],
  courseAssignmentData: [],
  courseProjectData: [],
  submittedAssignments: [],
  currentCourseID: null,
  isLoading: false,
  fileIsLoading: false,
  videoIsLoading: false,
  assignmentIsLoading: false,
  projectIsLoading: false,
  uploadAlert: null,
  deleteAlert: null,
  waitAlert: null,
  waitVideoAlert: null,
  isFileOperationInProgress: false,
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_CURRENT_COURSE_ID:
      return {
        ...state,
        currentCourseID: action.payload,
        isFileOperationInProgress: false,
      };
    case COURSE_PROJECT_START:
      return {
        ...state,
        projectIsLoading: true,
        isFileOperationInProgress: false,
      }
    case COURSE_ASSIGNMENT_START:
      return {
        ...state,
        assignmentIsLoading: true,
        isFileOperationInProgress: false,
      }
    case COURSE_FILE_START:
      return {
        ...state,
        fileIsLoading: true,
        isFileOperationInProgress: false,
      };
    case COURSE_VIDEO_START:
      return {
        ...state,
        videoIsLoading: true,
        isFileOperationInProgress: false,
      };
    case COURSES_START:
      return {
        ...state,
        isLoading: true,
        isFileOperationInProgress: false,
      };
    case COURSE_FILE_SUCCESS:
      return {
        ...state,
        courseFileData: [...state.courseFileData, payload],
        fileIsLoading: false,
      };
    case SET_FILES_WITH_PATHS:
      return {
        ...state,
        filesWithPaths: action.payload,
      };
    case COURSE_PROJECT_SUCCESS:
      return {
        ...state,
        courseProjectData: [payload],
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
        courseVideoData: [payload],
        videoIsLoading: false,
      };
    case COURSES_SUCCESS:
      return {
        ...state,
        coursesData: payload,
        isLoading: false,
        waitVideoAlert: null,
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
        deleteAlert: null
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
        uploadAlert: null,
      };
    case RESET_DELETE_ALERT:
      return {
        ...state,
        deleteAlert: null,
      };
    case SET_WAIT_VIDEO_ALERT:
      return {
        ...state,
        waitVideoAlert: action.payload,
      };
    case RESET_WAIT_VIDEO_ALERT:
      return {
        ...state,
        waitVideoAlert: null,
      };
    case SET_WAIT_ALERT:
      return {
        ...state,
        waitAlert: action.payload,
        deleteAlert: null,
        uploadAlert: null,
      };
    case RESET_WAIT_ALERT:
      return {
        ...state,
        waitAlert: null,
      };
    case START_FILE_OPERATION:
      return {
        ...state,
        fileIsLoading: false,
        videoIsLoading: false,
        assignmentIsLoading: false,
        projectIsLoading: false,
        isLoading: false,
        isFileOperationInProgress: true,
      };
    case FINISH_FILE_OPERATION:
      return {
        ...state,
        isFileOperationInProgress: false,
      };
    default:
      return state;
  }
};