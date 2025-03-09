import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { validateToken } from "./redux/slice/authSlice";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import EmployerDashboard from "./components/EmployerDashboard";
import JobSeekerDashboard from "./components/JobSeekerDashboard";
import SearchJobs from "./components/SearchJobs";
import ProfilePage from "./components/ProfilePage";

const App = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && !loading) {
      dispatch(validateToken());
    }
  }, [dispatch, user, loading]);

  const PrivateRoute = ({ children, role }) => {
    if (loading) return <div className="text-center mt-20">Loading...</div>;
    return user && user.role === role ? children : <Navigate to="/" />;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Router>
        <Navbar />
        <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<SearchJobs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            {/* Update with Register component */}
            <Route path="/job-seeker/profile" element={<ProfilePage />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/employer"
              element={
                <PrivateRoute role="employer">
                  <EmployerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/job_seeker"
              element={
                <PrivateRoute role="job_seeker">
                  <JobSeekerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/job-seeker/search"
              element={
                <PrivateRoute role="job_seeker">
                  <SearchJobs />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000/api",
//   withCredentials: true,
// });

// export const fetchJobs = createAsyncThunk(
//   "employer/fetchJobs",
//   async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.get("/employer/jobs", {
//         params: { page, limit },
//       });
//       return data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data.message || "Failed to fetch jobs"
//       );
//     }
//   }
// );

// export const createJob = createAsyncThunk(
//   "employer/createJob",
//   async (data, { rejectWithValue }) => {
//     try {
//       const { data: response } = await api.post("/employer/jobs", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       return response;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data.message || "Failed to create job"
//       );
//     }
//   }
// );

// export const updateJob = createAsyncThunk(
//   "employer/updateJob",
//   async ({ id, data }, { rejectWithValue }) => {
//     try {
//       const { data: response } = await api.patch(`/employer/jobs/${id}`, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       return { id, ...response };
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data.message || "Failed to update job"
//       );
//     }
//   }
// );

// const employerSlice = createSlice({
//   name: "employer",
//   initialState: {
//     jobs: [],
//     jobsPagination: null,
//     loading: false,
//     error: null,
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchJobs.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchJobs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.jobs = action.payload.data;
//         state.jobsPagination = action.payload.pagination;
//       })
//       .addCase(fetchJobs.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(createJob.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createJob.fulfilled, (state, action) => {
//         state.loading = false;
//         state.jobs.push({ id: action.payload.jobId, ...action.meta.arg }); // Simplified
//       })
//       .addCase(createJob.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(updateJob.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateJob.fulfilled, (state, action) => {
//         state.loading = false;
//         const { id } = action.payload;
//         const index = state.jobs.findIndex((job) => job.id === id);
//         if (index !== -1) {
//           const formData = action.meta.arg.data;
//           const updatedJob = { ...state.jobs[index] };
//           formData.forEach((value, key) => {
//             if (key !== "company_logo" && key !== "post_image")
//               updatedJob[key] = value;
//           });
//           state.jobs[index] = updatedJob;
//         }
//       })
//       .addCase(updateJob.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default employerSlice.reducer;
