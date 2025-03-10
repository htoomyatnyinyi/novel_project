// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // const api = axios.create({
// //   baseURL: "http://localhost:8080/api",
// //   // baseURL: `${process.env.BACKEND_API}/api`,
// //   withCredentials: true,
// // });

// const api = axios.create({
//   // baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
//   baseURL: import.meta.env.VITE_API_URL || "https://job-diary.onrender.com/api",
//   withCredentials: true,
// });
// export const createUser = createAsyncThunk("users/create", async (data) => {
//   const { data: res } = await api.post("/users", data);
//   return res.data;
// });

// export const fetchUsers = createAsyncThunk(
//   "users/fetch",
//   async ({ page = 1, limit = 10 }) => {
//     const { data } = await api.get("/users", { params: { page, limit } });
//     console.log(data, "at return");
//     return data;
//   }
// );

// export const updateUser = createAsyncThunk(
//   "users/update",
//   async ({ id, data }) => {
//     await api.patch(`/users/${id}`, data);
//     return { id, data };
//   }
// );

// export const deleteUser = createAsyncThunk("users/delete", async (id) => {
//   await api.delete(`/users/${id}`);
//   return id;
// });

// const userSlice = createSlice({
//   name: "users",
//   initialState: {
//     users: [],
//     loading: false,
//     error: null,
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.users = action.payload.data;
//       })
//       .addCase(updateUser.fulfilled, (state, action) => {
//         const { id, data } = action.payload;
//         state.users = state.users.map((user) =>
//           user.id === id ? { ...user, ...data } : user
//         );
//       })
//       .addCase(deleteUser.fulfilled, (state, action) => {
//         state.users = state.users.filter((user) => user.id !== action.payload);
//       });
//   },
// });

// export default userSlice.reducer;
