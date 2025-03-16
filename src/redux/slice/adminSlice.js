import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api.js";

// User CRUD Thunks
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async ({ page = 1, limit = 10, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/users", {
        params: { page, limit, role },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch users"
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "admin/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/admin/users", userData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Failed to create user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.patch(`/admin/users/${id}`, data);
      return { id, data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Failed to update user"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Failed to delete user"
      );
    }
  }
);

// Job CRUD Thunks
export const fetchJobs = createAsyncThunk(
  "admin/fetchJobs",
  async ({ page = 1, limit = 10, is_active }, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/job-posts", {
        params: { page, limit, is_active },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch jobs"
      );
    }
  }
);

export const updateJob = createAsyncThunk(
  "admin/updateJob",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const { data: response } = await api.patch(
        `/admin/job-posts/${id}`,
        data
      );
      console.log(data, id, " at slice");
      return { id, message: response.message }; // Return serializable data
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Failed to update job"
      );
    }
  }
);

// edit here hmnn53
// export const updateJob = createAsyncThunk(
//   "admin/updateJob",
//   async ({ id, data }, { rejectWithValue }) => {
//     console.log(id, data, "check at slice");
//     try {
//       const info = await api.put(`/admin/job-posts/${id}`, data);
//       console.log(info.data, "return info");
//       return { id, data };
//       // return info.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data.message || "Failed to update job"
//       );
//     }
//   }
// );

export const deleteJob = createAsyncThunk(
  "admin/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/job-posts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Failed to delete job"
      );
    }
  }
);

// Analytics Thunk
export const fetchAnalytics = createAsyncThunk(
  "admin/fetchAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/analytics");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch analytics"
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "admin/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/categories");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch categories"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    jobs: [],
    analytics: { total_users: 0, total_jobs: 0, total_applications: 0 },
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(fetchUsers.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.users = action.payload.data;
      // })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.userPagination = action.payload.pagination; // Should update here
        console.log("Fetched Users:", action.payload); // Debug log
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push({ id: action.payload.id, ...action.meta.arg });
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        const index = state.users.findIndex((user) => user.id === id);
        if (index !== -1)
          state.users[index] = { ...state.users[index], ...data };
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      // Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data;
        state.jobPagination = action.payload.pagination; // Should update here
        console.log("Fetched Jobs:", action.payload); // Debug log
      })
      // .addCase(fetchJobs.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.jobs = action.payload.data;
      // })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const { id } = action.payload;
        const index = state.jobs.findIndex((job) => job.id === id);
        if (index !== -1) {
          const updatedJob = { ...state.jobs[index] };
          const formData = action.meta.arg.data;
          formData.forEach((value, key) => {
            if (key !== "company_logo" && key !== "post_image") {
              updatedJob[key] = value;
            }
          });
          state.jobs[index] = updatedJob;
        }
      })

      // edit hmnn53
      // .addCase(updateJob.fulfilled, (state, action) => {
      //   const { id, data } = action.payload;
      //   const index = state.jobs.findIndex((job) => job.id === id);
      //   if (index !== -1) state.jobs[index] = { ...state.jobs[index], ...data };
      // })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      })
      // Analytics
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
