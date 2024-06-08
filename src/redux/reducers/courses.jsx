import {
  COURSES_START,
  COURSES_SUCCESS,
  COURSES_FAIL,
  COURSE_START,
  COURSE_SUCCESS,
  COURSE_FAIL,
} from '../actions/type'

const initialState = {
  coursesData: [],
  courseData: [],
  isLoading: false,
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case COURSE_START:
    case COURSES_START:
      return {
        ...state,
        isLoading: true,
      };
    case COURSE_SUCCESS:
      return {
        ...state,
        coursesData: payload,
        isLoading: false,
      };
    case COURSES_SUCCESS:
      return {
        ...state,
        courseData: payload,
        isLoading: false,
      };
    case COURSE_FAIL:
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
