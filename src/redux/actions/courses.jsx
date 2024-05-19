import axios from 'axios';
import {
  COURSES_START,
  COURSES_SUCCESS,
  COURSES_FAIL,
} from './type'


const apiUrl = "https://ezlearn.onrender.com/"

export const getCourses = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };

  dispatch({ type: COURSES_START });
  try {
    const res = await axios.get(`${apiUrl}getCourse/all`, config);
    if (res.data) {
      dispatch({
        type: COURSES_SUCCESS,
        payload: res.data
      });
    } else {
      dispatch({
        type: COURSES_FAIL,
      });
    }
  } catch {
    dispatch({
      type: COURSES_FAIL,
    });
  }
};
