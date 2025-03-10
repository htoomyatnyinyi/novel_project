import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080/api",
//   // baseURL: "https://job-diary.onrender.com/api",
//   withCredentials: true,
// });
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://job-diary.onrender.com/api",
  withCredentials: true,
});

console.log(import.meta.env.VITE_API_URL);
// Login thunk
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
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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

export default authSlice.reducer; // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080/api",
//   withCredentials: true,
// });

// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post("/auth/login", { email, password });
//       return data.user;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );

// export const logoutUser = createAsyncThunk("auth/logout", async () => {
//   await api.post("/auth/logout");
// });

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.user = null;
//       });
//   },
// });

// export default authSlice.reducer;
