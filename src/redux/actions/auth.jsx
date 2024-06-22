import axios from "axios";
import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_START,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
} from "./type";

const apiUrl = "https://thankful-ample-shrimp.ngrok-free.app/";

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'ngrok-skip-browser-warning': 'true',
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });
  dispatch({ type: LOGIN_START });

  try {
    const res = await axios.post(`${apiUrl}users/login`, body, config);
    console.log("asd")
    console.log("API response:", res.data);
    const userID = res.data.user._id
    const name = res.data.user.name
    if (res.data) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token: res.data.token,
          role: res.data.role,
          userID: userID,
          name: name
        },
      });
    } else {
      // notify();
      dispatch({
        type: LOGIN_FAIL,
      });
    }
  } catch {
    // notify();
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response?.data?.message || 'Login failed',
    });
  }
};

export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT_START });
  try {
    dispatch({
      type: LOGOUT_SUCCESS,
    });
  } catch {
    dispatch({
      type: LOGOUT_FAIL,
      payload: error.response?.data?.message || 'Logout failed',
    });
  }
};
