import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

console.log(
  import.meta.env.VITE_API_URL,
  "meta api",
  process.env.VITE_API_URL,
  "dotenv"
);

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  baseURL: "https://nobel-server.onrender.com/api" || process.env.VITE_API_URL,
  withCredentials: true,
});
// // Optional: Add interceptors for handling tokens, errors, etc.
// api.interceptors.request.use(
//   (config) => {
//     // console.log(config, " check at interceptors");
//     // Add any request modifications here, e.g., attaching tokens
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle global errors (e.g., 401 for unauthorized)
//     return Promise.reject(error);
//   }
// );

export default api;
