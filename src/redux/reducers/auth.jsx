import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from '../actions/type'

const initialState = {
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  isLoading: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_START:
      return {
        ...state,
        isLoading: true,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('role', action.payload.role);
      return {
        ...state,
        isLoading: false,
        token: action.payload.token,
        role: action.payload.role,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
