import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchProfile = createAsyncThunk(
  "employer/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("employer/profile");
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
      const response = await api.post("employer/profile", formData, {
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
      const response = await api.put("employer/profile", formData, {
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
      const response = await api.delete("employer/profile");
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
      const response = await api.get("employer/jobs");
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
      const response = await api.post("employer/jobs", formData, {
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
      const response = await api.put(`employer/jobs/${jobId}`, formData, {
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
      const response = await api.delete(`employer/jobs/${jobId}`);
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
      const response = await api.get("employer/applied-jobs");
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
      const response = await api.get("employer/analytics");
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
      const response = await api.put(
        `employer/applications/${applicationId}/status`,
        {
          status,
        }
      );
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

export default employerSlice.reducer;
