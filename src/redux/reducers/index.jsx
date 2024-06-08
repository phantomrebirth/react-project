import { combineReducers } from "redux";
import auth from "./auth";
import profile from "./profile";
import { logOutModalReducer } from "./logOutModal";

export default combineReducers({
  auth,
  profile,
  logOutModalReducer,
});
