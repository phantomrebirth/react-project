import axios from 'axios';
import {
  COURSES_START,
  COURSES_SUCCESS,
  COURSES_FAIL,
  COURSE_VIDEO_START,
  COURSE_VIDEO_SUCCESS,
  COURSE_VIDEO_FAIL,
  COURSE_FILE_START,
  COURSE_FILE_SUCCESS,
  COURSE_FILE_FAIL,
  COURSE_ASSIGNMENT_START,
  COURSE_ASSIGNMENT_SUCCESS,
  COURSE_ASSIGNMENT_FAIL,
  COURSE_PROJECT_START,
  COURSE_PROJECT_SUCCESS,
  COURSE_PROJECT_FAIL,
} from './type'


const apiUrl = "https://ezlearn.onrender.com/"

export const getCourses = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
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

export const getCourseProject = ({currentCourseID, projectID}) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  dispatch({ type: COURSE_PROJECT_START });
  try {
    const res = await axios.get(`${apiUrl}course/getProjects/${currentCourseID}/${projectID}`, config);
    if (res.data) {
      dispatch({
        type: COURSE_PROJECT_SUCCESS,
        payload: res.data
      });
    } else {
      dispatch({
        type: COURSE_PROJECT_FAIL,
      });
    }
  } catch {
    dispatch({
      type: COURSE_PROJECT_FAIL,
    });
  }
};


export const getCourseAssignment = ({currentCourseID, assignmentID}) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  dispatch({ type: COURSE_ASSIGNMENT_START });
  try {
    const res = await axios.get(`${apiUrl}course/getAssignments/${currentCourseID}/${assignmentID}`, config);
    if (res.data) {
      dispatch({
        type: COURSE_ASSIGNMENT_SUCCESS,
        payload: res.data
      });
    } else {
      dispatch({
        type: COURSE_ASSIGNMENT_FAIL,
      });
    }
  } catch {
    dispatch({
      type: COURSE_ASSIGNMENT_FAIL,
    });
  }
};

export const getCourseFile = ({currentCourseID, fileID}) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  dispatch({ type: COURSE_FILE_START });
  try {
    const res = await axios.get(`${apiUrl}course/getFiles/${currentCourseID}/${fileID}`, config);
    if (res.data) {
      dispatch({
        type: COURSE_FILE_SUCCESS,
        payload: res.data
      });
    } else {
      dispatch({
        type: COURSE_FILE_FAIL,
      });
    }
  } catch {
    dispatch({
      type: COURSE_FILE_FAIL,
    });
  }
};

export const getCourseVideo = ({currentCourseID, videoID}) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  dispatch({ type: COURSE_VIDEO_START });
  try {
    const res = await axios.get(`${apiUrl}course/getVideos/${currentCourseID}/${videoID}`, config);
    if (res.data) {
      dispatch({
        type: COURSE_VIDEO_SUCCESS,
        payload: res.data
      });
    } else {
      dispatch({
        type: COURSE_VIDEO_FAIL,
      });
    }
  } catch {
    dispatch({
      type: COURSE_VIDEO_FAIL,
    });
  }
};
