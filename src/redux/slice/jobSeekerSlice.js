import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const createProfile = createAsyncThunk(
  "jobSeeker/createProfile",
  async (data) => {
    const { data: res } = await api.post("/job-seeker/profile", data);
    return res.data;
  }
);

export const fetchProfile = createAsyncThunk(
  "jobSeeker/fetchProfile",
  async () => {
    const { data } = await api.get("/job-seeker/profile");
    return data.data;
  }
);

export const updateProfile = createAsyncThunk(
  "jobSeeker/updateProfile",
  async (data) => {
    await api.put("/job-seeker/profile", data);
    return data;
  }
);

export const deleteProfile = createAsyncThunk(
  "jobSeeker/deleteProfile",
  async () => {
    await api.delete("/job-seeker/profile");
  }
);

// Resumes
export const createResume = createAsyncThunk(
  "jobSeeker/createResume",
  async (formData) => {
    const { data } = await api.post("/job-seeker/resumes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }
);

export const fetchResumes = createAsyncThunk(
  "jobSeeker/fetchResumes",
  async () => {
    const { data } = await api.get("/job-seeker/resumes");
    return data.data;
  }
);

// export const fetchfileResume = createAsyncThunk(
//   "jobSeeker/fetchfileResume",
//   async (filename, { rejectWithValue }) => {
//     try {
//       // Construct the URL directly since the backend serves files statically
//       const fileUrl = `/uploads/${filename}`;
//       console.log(fileUrl, "at api return");
//       return fileUrl;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const fetchfileResume = createAsyncThunk(
  "jobSeeker/fetchfileResume",
  async (filename, { rejectWithValue }) => {
    try {
      // Use the endpoint instead of a static URL
      const response = await api.get(`/job-seeker/resumes/${filename}`, {
        responseType: "blob", // Important for binary data
      });
      const fileUrl = URL.createObjectURL(response.data);
      return fileUrl;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// export const fetchfileResume = createAsyncThunk(
//   "jobSeeker/fetchfileResume",
//   async (filename, { rejectWithValue }) => {
//     console.log(filename, "filename");
//     try {
//       const response = await api.get(`/job-seeker/resumes/${filename}`);
//       if (!response.ok) throw new Error("Failed to fetch file");
//       console.log(response, response.url, "return");
//       return response.url; // Return the file URL
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const deleteResume = createAsyncThunk(
  "jobSeeker/deleteResume",
  async (id) => {
    await api.delete(`/job-seeker/resumes/${id}`);
    return id;
  }
);

// Saved Jobs
export const createSavedJob = createAsyncThunk(
  "jobSeeker/createSavedJob",
  async (job_post_id) => {
    const { data } = await api.post("/job-seeker/saved-jobs", { job_post_id });
    console.log(data, " return savedData");
    return data;
  }
);

export const fetchSavedJobs = createAsyncThunk(
  "jobSeeker/fetchSavedJobs",
  async () => {
    const { data } = await api.get("/job-seeker/saved-jobs");
    return data.data;
  }
);

export const deleteSavedJob = createAsyncThunk(
  "jobSeeker/deleteSavedJob",
  async (id) => {
    await api.delete(`/job-seeker/saved-jobs/${id}`);
    return id;
  }
);

// Applications
export const createApplication = createAsyncThunk(
  "jobSeeker/createApplication",
  async ({ job_post_id, resume_id }) => {
    const { data } = await api.post("/job-seeker/applications", {
      job_post_id,
      resume_id,
    });
    return data;
  }
);

export const fetchApplications = createAsyncThunk(
  "jobSeeker/fetchApplications",
  async () => {
    const { data } = await api.get("/job-seeker/applications");
    return data.data;
  }
);

export const deleteApplication = createAsyncThunk(
  "jobSeeker/deleteApplication",
  async (id) => {
    await api.delete(`/job-seeker/applications/${id}`);
    return id;
  }
);

export const searchJobs = createAsyncThunk(
  "jobSeeker/searchJobs",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/job-posts/search", { params });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Failed to search jobs"
      );
    }
  }
);

export const fetchJobDetails = createAsyncThunk(
  "jobSeeker/fetchJobDetails",
  async (id, { rejectWithValue }) => {
    // console.log(id, "before fetch");
    const { data } = await api.get(`/job-posts/${id}`);
    // console.log(data.data, "at return job details");
    // return data.data;
    return { data: data.data };
  }
);

const jobSeekerSlice = createSlice({
  name: "jobSeeker",
  initialState: {
    profile: null,
    resumes: [],
    fileUrl: null,
    savedJobs: [],
    applications: [],
    searchResults: [], // Add searchResults to state
    jobDetails: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearFileUrl: (state) => {
      state.fileUrl = null;
    },
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
      .addCase(createResume.fulfilled, (state, action) => {
        state.resumes.push(action.payload);
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.resumes = action.payload;
      })
      .addCase(fetchfileResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchfileResume.fulfilled, (state, action) => {
        state.loading = false;
        state.fileUrl = action.payload;
      })
      .addCase(fetchfileResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter((r) => r.id !== action.payload);
      })
      .addCase(createSavedJob.fulfilled, (state, action) => {
        state.savedJobs.push(action.payload);
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.savedJobs = action.payload;
      })
      .addCase(deleteSavedJob.fulfilled, (state, action) => {
        state.savedJobs = state.savedJobs.filter(
          (s) => s.id !== action.payload
        );
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.applications.push(action.payload);
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.applications = action.payload;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          (a) => a.id !== action.payload
        );
      })
      .addCase(searchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJobDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.jobDetails = action.payload.data;
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFileUrl } = jobSeekerSlice.actions;
export default jobSeekerSlice.reducer;
