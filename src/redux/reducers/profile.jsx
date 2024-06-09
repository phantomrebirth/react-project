import {
  PROFILE_START,
  PROFILE_SUCCESS,
  PROFILE_FAIL,
  PROFILE_UPDATE_START,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAIL,
  PROFILE_DELETE_START,
  PROFILE_DELETE_SUCCESS,
  PROFILE_DELETE_FAIL,
  // USER_UPDATE_START,
  // USER_UPDATE_SUCCESS,
  // USER_UPDATE_FAIL,
  // USER_DATA_START,
  // USER_DATA_SUCCESS,
  // USER_DATA_FAIL,
} from "../actions/type";

const initialState = {
  // name: "",
  // email: "",
  // password: "",
  image: null,
  // user: "",
  // user_username: "",
  // user_image: "",
  isLoading: true,
  error: null,
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    // case USER_UPDATE_START:
    // case USER_DATA_START:
    case PROFILE_DELETE_START:
    case PROFILE_START:
    case PROFILE_UPDATE_START:
      return {
        ...state,
        isLoading: true,
      };
    // case USER_UPDATE_SUCCESS:
    //   return {
    //     ...state,
    //     name: payload.name,
    //     email: payload.email,
    //     password: payload.password,
    //     isLoading: false,
    //   }
    // case USER_DATA_SUCCESS:
    //   return {
    //     ...state,
    //     name: payload.name,
    //     email: payload.email,
    //     password: payload.password,
    //     isLoading: false,
    //   }
    case PROFILE_DELETE_SUCCESS:
      return {
        ...state,
        image: null,
        isLoading: false,
      }
    case PROFILE_UPDATE_SUCCESS:
    case PROFILE_SUCCESS:
      return {
        ...state,
        image: payload,
        isLoading: false,
      };
    // case USER_DATA_FAIL:
    // case USER_UPDATE_FAIL:
    case PROFILE_FAIL:
    case PROFILE_UPDATE_FAIL:
    case PROFILE_DELETE_FAIL:
      return {
        ...state,
        error: payload,
        isLoading: false
      };
    default:
      return state;
  }
}
