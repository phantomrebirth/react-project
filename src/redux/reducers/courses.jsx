import {
  COURSES_START,
  COURSES_SUCCESS,
  COURSES_FAIL,
} from '../actions/type'

const initialState = {
  data: [],
  isLoading: false,
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case COURSES_START:
      return {
        ...state,
        isLoading: true,
      };
    case COURSES_SUCCESS:
      return {
        ...state,
        data: payload,
        isLoading: false,
      };
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
