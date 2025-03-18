import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api.js";

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ username, email, password, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
        // role,
      });
      return { userId: data.userId, message: data.message };
      // return data;
      // return data.userId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      return data.user; // Assuming backend returns { user: { id, email, role } }
    } catch (error) {
      return rejectWithValue(error.response?.data.message || "Login failed");
    }
  }
);

// Logout thunk
export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  await api.post("/auth/logout");
});

// Validate token thunk (to check if session is still valid on refresh)
export const validateToken = createAsyncThunk(
  "auth/validateToken",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/me"); // Add this endpoint in backend if not present
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Token validation failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    info: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
