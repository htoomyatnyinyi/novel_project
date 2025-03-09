import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice.js";
import jobSeekerReducer from "./slice/jobSeekerSlice.js";
import employerReducer from "./slice/employerSlice.js";
import adminReducer from "./slice/adminSlice.js";
// import userReducer from "./slice/userSlice.js";

const rootReducer = combineReducers({
  auth: authReducer,
  jobSeeker: jobSeekerReducer,
  employer: employerReducer,
  admin: adminReducer,
  // users: userReducer,
});

export default rootReducer;
