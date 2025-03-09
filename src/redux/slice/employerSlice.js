import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const api = axios.create({
  // baseURL: "http://localhost:8080/api/employer",
  baseURL: `${process.env.BACKEND_API}/api/employer`,
  withCredentials: true,
});

export const fetchProfile = createAsyncThunk(
  "employer/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/profile");
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch profile");
    }
  }
);

export const createProfile = createAsyncThunk(
  "employer/createProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!response.data.success) throw new Error(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create profile");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "employer/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.put("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!response.data.success) throw new Error(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

export const deleteProfile = createAsyncThunk(
  "employer/deleteProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/profile");
      if (!response.data.success) throw new Error(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete profile");
    }
  }
);

export const fetchJobs = createAsyncThunk(
  "employer/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/jobs");
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch jobs");
    }
  }
);

export const createJob = createAsyncThunk(
  "employer/createJob",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/jobs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!response.data.success) throw new Error(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create job");
    }
  }
);

export const updateJob = createAsyncThunk(
  "employer/updateJob",
  async ({ jobId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/jobs/${jobId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!response.data.success) throw new Error(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update job");
    }
  }
);

export const deleteJob = createAsyncThunk(
  "employer/deleteJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      if (!response.data.success) throw new Error(response.data.message);
      return jobId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete job");
    }
  }
);

export const fetchAppliedJobs = createAsyncThunk(
  "employer/fetchAppliedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/applied-jobs");
      if (!response.data.success) {
        console.error("Fetch applied jobs failed:", response.data.message);
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      return rejectWithValue(error.message || "Failed to fetch applied jobs");
    }
  }
);

export const fetchAnalytics = createAsyncThunk(
  "employer/fetchAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/analytics");
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch analytics");
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  "employer/updateApplicationStatus",
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/applications/${applicationId}/status`, {
        status,
      });
      if (!response.data.success) throw new Error(response.data.message);
      return { applicationId, status };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to update application status"
      );
    }
  }
);

const employerSlice = createSlice({
  name: "employer",
  initialState: {
    profile: null,
    jobs: [],
    appliedJobs: [],
    analytics: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.profile = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(
          (job) => job.id === action.payload.id
        );
        if (index !== -1) state.jobs[index] = action.payload;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      })
      .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
        state.appliedJobs = action.payload;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.appliedJobs.forEach((job) => {
          const appIndex = job.applications.findIndex(
            (app) => app.id === action.payload.applicationId
          );
          if (appIndex !== -1)
            job.applications[appIndex].status = action.payload.status;
        });
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload;
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      );
  },
});

export default employerSlice.reducer; // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Axios instance with default config
// const api = axios.create({
//   baseURL: "http://localhost:8080/api/employer",
//   withCredentials: true, // Ensures cookies (e.g., accessToken, refreshToken) are sent with requests
// });

// export const fetchProfile = createAsyncThunk(
//   "employer/fetchProfile",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get("/profile");
//       if (!response.data.success) throw new Error(response.data.message);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch profile");
//     }
//   }
// );

// export const createProfile = createAsyncThunk(
//   "employer/createProfile",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/profile", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       if (!response.data.success) throw new Error(response.data.message);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to create profile");
//     }
//   }
// );

// export const updateProfile = createAsyncThunk(
//   "employer/updateProfile",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await api.put("/profile", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       if (!response.data.success) throw new Error(response.data.message);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to update profile");
//     }
//   }
// );

// export const deleteProfile = createAsyncThunk(
//   "employer/deleteProfile",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.delete("/profile");
//       if (!response.data.success) throw new Error(response.data.message);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to delete profile");
//     }
//   }
// );

// export const fetchJobs = createAsyncThunk(
//   "employer/fetchJobs",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get("/jobs");
//       if (!response.data.success) throw new Error(response.data.message);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch jobs");
//     }
//   }
// );

// export const createJob = createAsyncThunk(
//   "employer/createJob",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/jobs", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       if (!response.data.success) throw new Error(response.data.message);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to create job");
//     }
//   }
// );

// export const updateJob = createAsyncThunk(
//   "employer/updateJob",
//   async ({ jobId, formData }, { rejectWithValue }) => {
//     try {
//       const response = await api.put(`/jobs/${jobId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       if (!response.data.success) throw new Error(response.data.message);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to update job");
//     }
//   }
// );

// export const deleteJob = createAsyncThunk(
//   "employer/deleteJob",
//   async (jobId, { rejectWithValue }) => {
//     try {
//       const response = await api.delete(`/jobs/${jobId}`);
//       if (!response.data.success) throw new Error(response.data.message);
//       return jobId; // Return jobId for state update
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to delete job");
//     }
//   }
// );

// //original
// // export const fetchAppliedJobs = createAsyncThunk(
// //   "employer/fetchAppliedJobs",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await api.get("/applied-jobs");
// //       if (!response.data.success) throw new Error(response.data.message);
// //       console.log(response.data.data)
// //       return response.data.data;
// //     } catch (error) {
// //       return rejectWithValue(error.message || "Failed to fetch applied jobs");
// //     }
// //   }
// // );

// // // debug
// // export const fetchAppliedJobs = createAsyncThunk(
// //   "employer/fetchAppliedJobs",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await api.get("/applied-jobs");
// //       if (!response.data.success) throw new Error(response.data.message);
// //       console.log(response.data.data);
// //       return response.data.data;
// //     } catch (error) {
// //       return rejectWithValue(error.message || "Failed to fetch applied jobs");
// //     }
// //   }
// // );
// export const fetchAppliedJobs = createAsyncThunk(
//   "employer/fetchAppliedJobs",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get("/applied-jobs");
//       if (!response.data.success) {
//         console.error("Fetch applied jobs failed:", response.data.message);
//         throw new Error(response.data.message);
//       }
//       console.log(response, " return");
//       return response.data.data;
//     } catch (error) {
//       console.error("Error fetching applied jobs:", error);
//       return rejectWithValue(error.message || "Failed to fetch applied jobs");
//     }
//   }
// );
// // de
// // bug

// // before edit
// // export const fetchAppliedJobs = createAsyncThunk(
// //   "employer/fetchAppliedJobs",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await api.get("/applied-jobs");
// //       console.log(response.data.data, "at return applied job");

// //       if (!response.data.success) throw new Error(response.data.message);
// //       return response.data.data.map((job) => ({
// //         ...job,
// //         applications: job.applicant_ids
// //           ? job.applicant_ids.split(",").map((id, index) => ({
// //               id: index + 1, // Temporary ID, replace with actual application ID from backend
// //               // id: index + 1, // Temporary ID, replace with actual application ID from backend
// //               user_id: id, // job application
// //               status: job.application_statuses.split(",")[index],
// //             }))
// //           : [],
// //       }));
// //     } catch (error) {
// //       return rejectWithValue(error.message || "Failed to fetch applied jobs");
// //     }
// //   }
// // );
// // edit here
// // export const fetchAppliedJobs = createAsyncThunk(
// //   "employer/fetchAppliedJobs",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await api.get("/applied-jobs");
// //       console.log(response.data.data, "at return applied job");

// //       if (!response.data.success) throw new Error(response.data.message);
// //       const info = response.data.data.map((job) => ({
// //         ...job,
// //         applications: job.applicant_ids
// //           ? job.applicant_ids.split(",").map((id, index) => ({
// //               id: index + 1, // Temporary ID, replace with actual application ID from backend
// //               // id: index + 1, // Temporary ID, replace with actual application ID from backend
// //               user_id: id, // job application
// //               status: job.application_statuses.split(",")[index],
// //             }))
// //           : [],
// //       }));
// //       console.log(info, "ready to return");
// //       return info;
// //     } catch (error) {
// //       return rejectWithValue(error.message || "Failed to fetch applied jobs");
// //     }
// //   }
// // );

// export const fetchAnalytics = createAsyncThunk(
//   "employer/fetchAnalytics",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get("/analytics");
//       if (!response.data.success) throw new Error(response.data.message);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch analytics");
//     }
//   }
// );

// export const updateApplicationStatus = createAsyncThunk(
//   "employer/updateApplicationStatus",
//   async ({ applicationId, status }, { rejectWithValue }) => {
//     console.log(applicationId, status, "at slice");
//     try {
//       const response = await api.put(`/applications/${applicationId}/status`, {
//         status,
//       });
//       if (!response.data.success) throw new Error(response.data.message);
//       return { applicationId, status };
//     } catch (error) {
//       return rejectWithValue(
//         error.message || "Failed to update application status"
//       );
//     }
//   }
// );

// const employerSlice = createSlice({
//   name: "employer",
//   initialState: {
//     profile: null,
//     jobs: [],
//     appliedJobs: [],
//     analytics: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.profile = action.payload;
//       })
//       .addCase(fetchProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(createProfile.fulfilled, (state, action) => {
//         state.profile = action.payload;
//       })
//       .addCase(updateProfile.fulfilled, (state, action) => {
//         state.profile = { ...state.profile, ...action.payload };
//       })
//       .addCase(deleteProfile.fulfilled, (state) => {
//         state.profile = null;
//       })
//       .addCase(fetchJobs.fulfilled, (state, action) => {
//         state.jobs = action.payload;
//       })
//       .addCase(createJob.fulfilled, (state, action) => {
//         state.jobs.push(action.payload);
//       })
//       .addCase(updateJob.fulfilled, (state, action) => {
//         const index = state.jobs.findIndex(
//           (job) => job.id === action.payload.id
//         );
//         if (index !== -1) state.jobs[index] = action.payload;
//       })
//       .addCase(deleteJob.fulfilled, (state, action) => {
//         state.jobs = state.jobs.filter((job) => job.id !== action.payload);
//       })
//       .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
//         state.appliedJobs = action.payload;
//       })
//       .addCase(fetchAnalytics.fulfilled, (state, action) => {
//         state.analytics = action.payload;
//       })
//       .addCase(updateApplicationStatus.fulfilled, (state, action) => {
//         state.appliedJobs.forEach((job) => {
//           const appIndex = job.applications.findIndex(
//             (app) => app.id === action.payload.applicationId
//           );
//           if (appIndex !== -1)
//             job.applications[appIndex].status = action.payload.status;
//         });
//       })
//       .addMatcher(
//         (action) => action.type.endsWith("/rejected"),
//         (state, action) => {
//           state.error = action.payload;
//           state.loading = false;
//         }
//       )
//       .addMatcher(
//         (action) => action.type.endsWith("/pending"),
//         (state) => {
//           state.loading = true;
//           state.error = null;
//         }
//       );
//   },
// });

// export default employerSlice.reducer; // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "axios";

// // const api = axios.create({
// //   baseURL: "http://localhost:8080/api",
// //   withCredentials: true,
// // });

// // export const createProfile = createAsyncThunk(
// //   "employer/createProfile",
// //   async (formData) => {
// //     const { data } = await api.post("/employer/profile", formData, {
// //       headers: { "Content-Type": "multipart/form-data" },
// //     });
// //     return data.data;
// //   }
// // );

// // export const fetchProfile = createAsyncThunk(
// //   "employer/fetchProfile",
// //   async () => {
// //     const { data } = await api.get("/employer/profile");
// //     return data.data;
// //   }
// // );

// // export const updateProfile = createAsyncThunk(
// //   "employer/updateProfile",
// //   async (data) => {
// //     await api.put("/employer/profile", data);
// //     return data;
// //   }
// // );

// // export const deleteProfile = createAsyncThunk(
// //   "employer/deleteProfile",
// //   async () => {
// //     await api.delete("/employer/profile");
// //   }
// // );

// // export const createJob = createAsyncThunk(
// //   "employer/createJob",
// //   async (formData) => {
// //     const { data } = await api.post("/job-posts", formData, {
// //       headers: { "Content-Type": "multipart/form-data" },
// //     });
// //     console.log(data, "check returnat slice");
// //     return data;
// //   }
// // );

// // export const fetchJobs = createAsyncThunk("employer/fetchJobs", async () => {
// //   const { data } = await api.get("/job-posts");
// //   return data.data;
// // });

// // export const fetchAnalytics = createAsyncThunk(
// //   "employer/fetchAnalytics",
// //   async (_, { rejectWithValue }) => {
// //     const response = await fetch("/api/employer/analytics", {
// //       headers: { Authorization: "Bearer token" },
// //     });
// //     const data = await response.json();
// //     if (!data.success) throw rejectWithValue(data.message);
// //     return data.data;
// //   }
// // );

// // const employerSlice = createSlice({
// //   name: "employer",
// //   initialState: {
// //     profile: null,
// //     jobs: [],
// //     loading: false,
// //     error: null,
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(createProfile.fulfilled, (state, action) => {
// //         state.profile = action.payload;
// //       })
// //       .addCase(fetchProfile.fulfilled, (state, action) => {
// //         state.profile = action.payload;
// //       })
// //       .addCase(updateProfile.fulfilled, (state, action) => {
// //         state.profile = { ...state.profile, ...action.payload };
// //       })
// //       .addCase(deleteProfile.fulfilled, (state) => {
// //         state.profile = null;
// //       })
// //       .addCase(createJob.fulfilled, (state, action) => {
// //         state.jobs.push(action.payload);
// //       })
// //       .addCase(fetchJobs.fulfilled, (state, action) => {
// //         state.jobs = action.payload;
// //       });
// //   },
// // });

// // export default employerSlice.reducer; // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // // import axios from "axios";

// // // const api = axios.create({
// // //   baseURL: "http://localhost:8080/api",
// // //   withCredentials: true,
// // // });

// // // export const createProfile = createAsyncThunk(
// // //   "employer/createProfile",
// // //   async (formData) => {
// // //     const { data } = await api.post("/employer/profile", formData, {
// // //       headers: { "Content-Type": "multipart/form-data" },
// // //     });
// // //     return data.data;
// // //   }
// // // );

// // // export const fetchProfile = createAsyncThunk(
// // //   "employer/fetchProfile",
// // //   async () => {
// // //     const { data } = await api.get("/employer/profile");
// // //     return data.data;
// // //   }
// // // );

// // // export const updateProfile = createAsyncThunk(
// // //   "employer/updateProfile",
// // //   async (data) => {
// // //     await api.put("/employer/profile", data);
// // //     return data;
// // //   }
// // // );

// // // export const deleteProfile = createAsyncThunk(
// // //   "employer/deleteProfile",
// // //   async () => {
// // //     await api.delete("/employer/profile");
// // //   }
// // // );

// // // export const createJob = createAsyncThunk(
// // //   "employer/createJob",
// // //   async (formData) => {
// // //     console.log(formData, " at emp slice");
// // //     const { data } = await api.post("/job-posts", formData, {
// // //       headers: { "Content-Type": "multipart/form-data" },
// // //     });
// // //     return data;
// // //   }
// // // );

// // // export const fetchJobs = createAsyncThunk("employer/fetchJobs", async () => {
// // //   const { data } = await api.get("/job-posts");
// // //   return data.data;
// // // });

// // // const employerSlice = createSlice({
// // //   name: "employer",
// // //   initialState: {
// // //     profile: null,
// // //     jobs: [],
// // //     loading: false,
// // //     error: null,
// // //   },
// // //   extraReducers: (builder) => {
// // //     builder
// // //       .addCase(createProfile.fulfilled, (state, action) => {
// // //         state.profile = action.payload;
// // //       })
// // //       .addCase(fetchProfile.fulfilled, (state, action) => {
// // //         state.profile = action.payload;
// // //       })
// // //       .addCase(updateProfile.fulfilled, (state, action) => {
// // //         state.profile = { ...state.profile, ...action.payload };
// // //       })
// // //       .addCase(deleteProfile.fulfilled, (state) => {
// // //         state.profile = null;
// // //       })
// // //       .addCase(createJob.fulfilled, (state, action) => {
// // //         state.jobs.push(action.payload);
// // //       })
// // //       .addCase(fetchJobs.fulfilled, (state, action) => {
// // //         state.jobs = action.payload;
// // //       });
// // //   },
// // // });

// // // export default employerSlice.reducer;
// // // // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // // // import axios from "axios";

// // // // const api = axios.create({
// // // //   baseURL: "http://localhost:8080/api",
// // // //   withCredentials: true,
// // // // });

// // // // export const fetchEmployerProfile = createAsyncThunk(
// // // //   "employer/fetchProfile",
// // // //   async () => {
// // // //     const { data } = await api.get("/employer/profile");
// // // //     return data.data;
// // // //   }
// // // // );

// // // // export const createProfile = createAsyncThunk(
// // // //   "employer/createProfile",
// // // //   async (formData) => {
// // // //     const { data } = await api.post("/employer/profile", formData, {
// // // //       headers: { "Content-Type": "multipart/form-data" },
// // // //     });
// // // //     return data.data;
// // // //   }
// // // // );

// // // // export const postNewJob = createAsyncThunk(
// // // //   "employer/postJob",
// // // //   async (formData) => {
// // // //     const { data } = await api.post("/job-posts", formData, {
// // // //       headers: { "Content-Type": "multipart/form-data" },
// // // //     });
// // // //     return data;
// // // //   }
// // // // );

// // // // export const getJobAnalytics = createAsyncThunk(
// // // //   "employer/fetchJobAnalytics",
// // // //   async (id) => {
// // // //     const { data } = await api.get(`/employer/job-posts/${id}/analytics`);
// // // //     return data.data;
// // // //   }
// // // // );

// // // // const employerSlice = createSlice({
// // // //   name: "employer",
// // // //   initialState: {
// // // //     profile: null,
// // // //     jobs: [],
// // // //     analytics: {},
// // // //     loading: false,
// // // //     error: null,
// // // //   },
// // // //   extraReducers: (builder) => {
// // // //     builder
// // // //       .addCase(fetchEmployerProfile.pending, (state) => {
// // // //         state.loading = true;
// // // //         state.error = null;
// // // //       })
// // // //       .addCase(fetchEmployerProfile.fulfilled, (state, action) => {
// // // //         state.loading = false;
// // // //         state.profile = action.payload;
// // // //       })
// // // //       .addCase(fetchEmployerProfile.rejected, (state, action) => {
// // // //         state.loading = false;
// // // //         state.error = action.payload || "Failed to fetch profile";
// // // //       })
// // // //       .addCase(createProfile.fulfilled, (state, action) => {
// // // //         state.profile = action.payload;
// // // //       })
// // // //       .addCase(postNewJob.fulfilled, (state, action) => {
// // // //         state.jobs.push(action.payload);
// // // //       })
// // // //       .addCase(getJobAnalytics.fulfilled, (state, action) => {
// // // //         state.analytics = action.payload;
// // // //       });
// // // //   },
// // // // });

// // // // export default employerSlice.reducer;
