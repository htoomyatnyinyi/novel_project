import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

export const createProfile = createAsyncThunk(
  "employer/createProfile",
  async (formData) => {
    const { data } = await api.post("/employer/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  }
);

export const fetchProfile = createAsyncThunk(
  "employer/fetchProfile",
  async () => {
    const { data } = await api.get("/employer/profile");
    return data.data;
  }
);

export const updateProfile = createAsyncThunk(
  "employer/updateProfile",
  async (data) => {
    await api.put("/employer/profile", data);
    return data;
  }
);

export const deleteProfile = createAsyncThunk(
  "employer/deleteProfile",
  async () => {
    await api.delete("/employer/profile");
  }
);

export const createJob = createAsyncThunk(
  "employer/createJob",
  async (formData) => {
    const { data } = await api.post("/job-posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(data, "check returnat slice");
    return data;
  }
);

export const fetchJobs = createAsyncThunk("employer/fetchJobs", async () => {
  const { data } = await api.get("/job-posts");
  return data.data;
});

const employerSlice = createSlice({
  name: "employer",
  initialState: {
    profile: null,
    jobs: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.profile = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
      });
  },
});

export default employerSlice.reducer; // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080/api",
//   withCredentials: true,
// });

// export const createProfile = createAsyncThunk(
//   "employer/createProfile",
//   async (formData) => {
//     const { data } = await api.post("/employer/profile", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return data.data;
//   }
// );

// export const fetchProfile = createAsyncThunk(
//   "employer/fetchProfile",
//   async () => {
//     const { data } = await api.get("/employer/profile");
//     return data.data;
//   }
// );

// export const updateProfile = createAsyncThunk(
//   "employer/updateProfile",
//   async (data) => {
//     await api.put("/employer/profile", data);
//     return data;
//   }
// );

// export const deleteProfile = createAsyncThunk(
//   "employer/deleteProfile",
//   async () => {
//     await api.delete("/employer/profile");
//   }
// );

// export const createJob = createAsyncThunk(
//   "employer/createJob",
//   async (formData) => {
//     console.log(formData, " at emp slice");
//     const { data } = await api.post("/job-posts", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return data;
//   }
// );

// export const fetchJobs = createAsyncThunk("employer/fetchJobs", async () => {
//   const { data } = await api.get("/job-posts");
//   return data.data;
// });

// const employerSlice = createSlice({
//   name: "employer",
//   initialState: {
//     profile: null,
//     jobs: [],
//     loading: false,
//     error: null,
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createProfile.fulfilled, (state, action) => {
//         state.profile = action.payload;
//       })
//       .addCase(fetchProfile.fulfilled, (state, action) => {
//         state.profile = action.payload;
//       })
//       .addCase(updateProfile.fulfilled, (state, action) => {
//         state.profile = { ...state.profile, ...action.payload };
//       })
//       .addCase(deleteProfile.fulfilled, (state) => {
//         state.profile = null;
//       })
//       .addCase(createJob.fulfilled, (state, action) => {
//         state.jobs.push(action.payload);
//       })
//       .addCase(fetchJobs.fulfilled, (state, action) => {
//         state.jobs = action.payload;
//       });
//   },
// });

// export default employerSlice.reducer;
// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "axios";

// // const api = axios.create({
// //   baseURL: "http://localhost:8080/api",
// //   withCredentials: true,
// // });

// // export const fetchEmployerProfile = createAsyncThunk(
// //   "employer/fetchProfile",
// //   async () => {
// //     const { data } = await api.get("/employer/profile");
// //     return data.data;
// //   }
// // );

// // export const createProfile = createAsyncThunk(
// //   "employer/createProfile",
// //   async (formData) => {
// //     const { data } = await api.post("/employer/profile", formData, {
// //       headers: { "Content-Type": "multipart/form-data" },
// //     });
// //     return data.data;
// //   }
// // );

// // export const postNewJob = createAsyncThunk(
// //   "employer/postJob",
// //   async (formData) => {
// //     const { data } = await api.post("/job-posts", formData, {
// //       headers: { "Content-Type": "multipart/form-data" },
// //     });
// //     return data;
// //   }
// // );

// // export const getJobAnalytics = createAsyncThunk(
// //   "employer/fetchJobAnalytics",
// //   async (id) => {
// //     const { data } = await api.get(`/employer/job-posts/${id}/analytics`);
// //     return data.data;
// //   }
// // );

// // const employerSlice = createSlice({
// //   name: "employer",
// //   initialState: {
// //     profile: null,
// //     jobs: [],
// //     analytics: {},
// //     loading: false,
// //     error: null,
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(fetchEmployerProfile.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchEmployerProfile.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.profile = action.payload;
// //       })
// //       .addCase(fetchEmployerProfile.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload || "Failed to fetch profile";
// //       })
// //       .addCase(createProfile.fulfilled, (state, action) => {
// //         state.profile = action.payload;
// //       })
// //       .addCase(postNewJob.fulfilled, (state, action) => {
// //         state.jobs.push(action.payload);
// //       })
// //       .addCase(getJobAnalytics.fulfilled, (state, action) => {
// //         state.analytics = action.payload;
// //       });
// //   },
// // });

// // export default employerSlice.reducer;
