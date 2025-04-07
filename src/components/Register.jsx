import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId, message, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("employer"); // Default role

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dispatch the registerUser action
    const result = dispatch(
      registerUser({ email, password, confirmPassword, username, role })
    );

    // Check if registration was successful
    if (registerUser.fulfilled.match(result)) {
      toast.success("User registered successfully! Redirecting to login..."); // Success toast
      console.log(result.payload, "User Registered Successfully");
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
    } else {
      toast.error(`Registration failed: ${result.payload || "Unknown error"}`); // Error toast
      console.error("Registration Failed:", result.payload);
    }

    // Reset form fields
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRole("employer");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Register</h1>

      {/* Toast Container */}
      <ToastContainer
        position="top-right" // Position of the toast
        autoClose={2000} // Auto close after 2 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Display messages (optional, since we're using toast now) */}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {userId && <p className="text-green-500 mb-4">User {userId} created!</p>}

      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white dark:bg-gray-800 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="ConfirmPassword"
          required
          className="w-full p-2 border rounded mb-3"
        />

        {/* Role Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white">Role:</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="employer"
                checked={role === "employer"}
                onChange={(e) => setRole(e.target.value)}
                name="role"
                className="form-radio"
              />
              Employer
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="job_seeker"
                checked={role === "job_seeker"}
                onChange={(e) => setRole(e.target.value)}
                name="role"
                className="form-radio"
              />
              Job Seeker
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { registerUser } from "../redux/slice/authSlice";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { userId, message, error } = useSelector((state) => state.auth);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [username, setUsername] = useState("");
//   const [role, setRole] = useState("employer"); // Default role

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const result = dispatch(
//       registerUser({ email, password, confirmPassword, username, role })
//     );

//     if (registerUser.fulfilled.match(result)) {
//       console.log(result.payload, "User Registered Successfully");
//       navigate("/login");
//     } else {
//       console.error("Registration Failed:", result.payload);
//     }

//     setUsername("");
//     setEmail("");
//     setPassword("");
//     setConfirmPassword("");
//     setRole("employer"); // Reset role
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-3xl font-bold mb-4">Register</h1>

//       {/* Display messages */}
//       {message && <p className="text-green-500 mb-4">{message}</p>}
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       {userId && <p className="text-green-500 mb-4">User {userId} created!</p>}

//       <form
//         onSubmit={handleSubmit}
//         className="p-6 bg-white dark:bg-gray-800 rounded shadow-md w-96"
//       >
//         <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="Username"
//           required
//           className="w-full p-2 border rounded mb-3"
//         />
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//           className="w-full p-2 border rounded mb-3"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//           className="w-full p-2 border rounded mb-3"
//         />
//         <input
//           type="password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           placeholder="ConfirmPassword"
//           required
//           className="w-full p-2 border rounded mb-3"
//         />

//         {/* Role Selection */}
//         <div className="mb-4">
//           <label className="block text-gray-700 dark:text-white">Role:</label>
//           <div className="flex gap-4 mt-2">
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 value="employer"
//                 checked={role === "employer"}
//                 onChange={(e) => setRole(e.target.value)}
//                 name="role"
//                 className="form-radio"
//               />
//               Employer
//             </label>

//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 value="job_seeker"
//                 checked={role === "job_seeker"}
//                 onChange={(e) => setRole(e.target.value)}
//                 name="role"
//                 className="form-radio"
//               />
//               Job Seeker
//             </label>
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded transition"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;
