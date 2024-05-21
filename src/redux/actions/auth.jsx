import axios from "axios";
import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_START,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
} from "./type";

const apiUrl = "https://ezlearn.onrender.com/";

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });
  dispatch({ type: LOGIN_START });

  try {
    const res = await axios.post(`${apiUrl}users/login`, body, config);
    console.log("API response:", res.data); // Debug: Log the API response
    if (res.data) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { token: res.data.token, role: res.data.role }, // Ensure payload contains token and role
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
    });
    throw error; // Re-throw the error to be caught in handleSubmit
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
    });
  }
};
