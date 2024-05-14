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

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_START:
      return {
        ...state,
        isLoading: true,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      localStorage.setItem('role', payload.role);
      return {
        ...state,
        isLoading: false,
        token: payload.token,
        role: payload.role,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
    default:
      return state;
  }
};

