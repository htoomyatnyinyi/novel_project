import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { validateToken } from "./redux/slice/authSlice";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import EmployerDashboard from "./components/EmployerDashboard";
import JobSeekerDashboard from "./components/JobSeekerDashboard";
import SearchJobs from "./components/SearchJobs";
import ProfilePage from "./components/ProfilePage";

const App = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && !loading) {
      dispatch(validateToken());
    }
  }, [dispatch, user, loading]);

  const PrivateRoute = ({ children, role }) => {
    if (loading) return <div>Loading...</div>;
    return user && user.role === role ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<SearchJobs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />{" "}
        <Route path="/job-seeker/profile" element={<ProfilePage />} />
        {/* Placeholder for Register */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/employer"
          element={
            <PrivateRoute role="employer">
              <EmployerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/job_seeker"
          element={
            <PrivateRoute role="job_seeker">
              <JobSeekerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/job-seeker/search"
          element={
            <PrivateRoute role="job_seeker">
              <SearchJobs />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

// import React, { useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
// } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { validateToken } from "./redux/slice/authSlice";
// import Login from "./components/Login";
// import AdminDashboard from "./components/AdminDashboard";
// import EmployerDashboard from "./components/EmployerDashboard";
// import JobSeekerDashboard from "./components/JobSeekerDashboard";
// import SearchJobs from "./components/SearchJobs";

// const App = () => {
//   const dispatch = useDispatch();
//   const { user, loading } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (!user && !loading) {
//       dispatch(validateToken());
//     }
//   }, [dispatch, user, loading]);

//   const PrivateRoute = ({ children, role }) => {
//     if (loading) return <div>Loading...</div>;
//     return user && user.role === role ? children : <Navigate to="/" />;
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* <Route path="/" element={<Login />} /> */}
//         <Route
//           path="/admin"
//           element={
//             <PrivateRoute role="admin">
//               <AdminDashboard />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/employer"
//           element={
//             <PrivateRoute role="employer">
//               <EmployerDashboard />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/job_seeker"
//           element={
//             <PrivateRoute role="job_seeker">
//               <JobSeekerDashboard />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/job-seeker/search"
//           element={
//             <PrivateRoute role="job_seeker">
//               <SearchJobs />
//             </PrivateRoute>
//           }
//         />
//         <Route path="/" element={<SearchJobs />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App; // import React, { useEffect } from "react";
// // import {
// //   BrowserRouter as Router,
// //   Route,
// //   Routes,
// //   Navigate,
// // } from "react-router-dom";
// // import { useDispatch, useSelector } from "react-redux";

// // import { validateToken } from "./redux/slice/authSlice.js";
// // import Login from "./components/Login.jsx";
// // import AdminDashboard from "./components/AdminDashboard";
// // import EmployerDashboard from "./components/EmployerDashboard";
// // import JobSeekerDashboard from "./components/JobSeekerDashboard";

// // const App = () => {
// //   const dispatch = useDispatch();
// //   const { user, loading } = useSelector((state) => state.auth);

// //   useEffect(() => {
// //     if (!user && !loading) {
// //       dispatch(validateToken()); // Validate token on app load
// //     }
// //   }, [dispatch, user, loading]);

// //   const PrivateRoute = ({ children, role }) => {
// //     if (loading) return <div>Loading...</div>;
// //     return user && user.role === role ? children : <Navigate to="/" />;
// //   };

// //   return (
// //     <Router>
// //       <Routes>
// //         <Route path="/" element={<Login />} />
// //         <Route
// //           path="/admin"
// //           element={
// //             <PrivateRoute role="admin">
// //               <AdminDashboard />
// //             </PrivateRoute>
// //           }
// //         />
// //         <Route
// //           path="/employer"
// //           element={
// //             <PrivateRoute role="employer">
// //               <EmployerDashboard />
// //             </PrivateRoute>
// //           }
// //         />
// //         <Route
// //           path="/job_seeker"
// //           element={
// //             <PrivateRoute role="job_seeker">
// //               <JobSeekerDashboard />
// //             </PrivateRoute>
// //           }
// //         />
// //       </Routes>
// //     </Router>
// //   );
// // };

// // export default App;
