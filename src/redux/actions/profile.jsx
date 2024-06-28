import axios from "axios";
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
} from "./type";
import apiUrl from "../../components/ApiUrl";

const ApiUrl = `${apiUrl}/users`;

export const profile = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
      // 'User-Agent': 'CustomUserAgent',
    },
    responseType: 'blob'
  };

  dispatch({ type: PROFILE_START });
  try {
    const res = await axios.get(`${ApiUrl}/getPP`, config)
    if (res.data) {
      const imageUrl = URL.createObjectURL(res.data);
      dispatch({
        type: PROFILE_SUCCESS,
        payload: imageUrl,
      });
    } else {
      dispatch({
        type: PROFILE_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: PROFILE_FAIL,
    });
    console.log(err)
  }
};

export const deleteProfile = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  console.log(token)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
      // 'User-Agent': 'CustomUserAgent',
    },
  };

  // const body = data
  dispatch({ type: PROFILE_DELETE_START });
  try {
    const res = await axios.delete(`${ApiUrl}/deletePP`, config);
    if (res.data) {
      dispatch({
        type: PROFILE_DELETE_FAIL,
      });
    } else {
      dispatch({
        type: PROFILE_DELETE_SUCCESS,
        payload: res.data,
      });
    }
  } catch (err) {
    dispatch({
      type: PROFILE_DELETE_FAIL,
    });
  }
};

export const profileUpdate = (formData) => async (dispatch, getState) => {
  const token = getState().auth.token;
  const config = {
    headers: {
      'ngrok-skip-browser-warning': 'true',
      // 'User-Agent': 'CustomUserAgent',
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const body = formData;
  dispatch({ type: PROFILE_UPDATE_START });
  try {
    const res = await axios.post(`${ApiUrl}/profilePicture`, body, config);
    console.log(res.data)

    if (res.status === 200 || res.status === 201) {
      dispatch({
        type: PROFILE_UPDATE_SUCCESS,
        // payload: res.data,
      });
    } else {
      dispatch({
        type: PROFILE_UPDATE_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: PROFILE_UPDATE_FAIL,
    });
    console.log(err)
  }
};

// export const userData = () => async (dispatch, getState) => {
//   const token = getState().auth.token;
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   dispatch({ type: USER_DATA_START });
//   try {
//     const res = await axios.get(`${apiUrl}/me`, config);
//     console.log(res.data)
//     if (res.data){
//       dispatch({
//         type: USER_DATA_SUCCESS,
//         payload: res.data,
//       });
//     } else {
//       dispatch({
//         type: USER_DATA_FAIL,
//       });
//     }
//   } catch (err) {
//     dispatch({
//       type: USER_DATA_FAIL,
//     });
//   }
// };

// export const userUpdate = (username, email) => async (dispatch, getState) => {
//   const token = getState().auth.token;
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   const body = JSON.stringify({ username, email });
//   dispatch({ type: USER_UPDATE_START });
//   try {
//     dispatch({ type: FETCH_DATA_START });
//     const res = await axios.patch(`${apiUrl}/update`, body, config);
//     if (res.data) {
//       dispatch({
//         type: USER_UPDATE_SUCCESS,
//         payload: res.data,
//       });
//     } else {
//       dispatch({
//         type: USER_UPDATE_FAIL,
//       });
//     }
//   } catch (err) {
//     dispatch({
//       type: USER_UPDATE_FAIL,
//     });
//   }
// };
