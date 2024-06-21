import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_START,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
} from '../actions/type'

const initialState = {
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  userID: localStorage.getItem('userID') || null,
  name: localStorage.getItem('name') || null,
  isLoading: false,
  error: null,
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGOUT_START:
    case LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      localStorage.setItem('role', payload.role);
      localStorage.setItem('userID', payload.userID);
      localStorage.setItem('name', payload.name);
      return {
        ...state,
        isLoading: false,
        token: payload.token,
        role: payload.role,
        userID: payload.userID,
        name: payload.name,
        error: null,
      };
    case LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userID');
      localStorage.removeItem('name');
      return {
        ...state,
        isLoading: false,
        token: null,
        role: null,
        userID: null,
        name: null,
        error: null,
      }
    case LOGOUT_FAIL:
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

