import axios from "axios";
import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  // LOGOUT_START,
  // LOGOUT_SUCCESS,
  // LOGOUT_FAIL,
  // CHECK_AUTH_SUCCESS,
  // CHECK_AUTH_FAIL,
} from "../action/type";
import Cookies from "js-cookie";

const apiUrl = "https://ezlearn.onrender.com/"

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };
  const body = JSON.stringify({ email, password });
  dispatch({ type: LOGIN_START });
  try {
    const res = await axios.post(`${apiUrl}users/login`, body, config);
    if (res.data) {
      dispatch({
        type: LOGIN_SUCCESS,
      });
    } else {
      notify();
      dispatch({
        type: LOGIN_FAIL,
      });
    }
  } catch {
    notify();
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};
