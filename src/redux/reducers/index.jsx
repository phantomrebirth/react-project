import { combineReducers } from "redux";
import auth from "./auth";
import profile from "./profile";
import { logOutModalReducer } from "./logOutModal";
import courses from "./courses";

export default combineReducers({
  auth,
  profile,
  logOutModalReducer,
  courses,
});
