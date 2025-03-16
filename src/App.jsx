import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
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
import Home from "./pages/Home";
import EditProfilePage from "./components/EditPorfilePage";

const App = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]); // Removed user/loading from deps to validate on mount always

  const PrivateRoute = ({ children, role }) => {
    const location = useLocation();

    if (loading) {
      return <div className="text-center mt-20">Loading...</div>;
    }

    if (!user) {
      // Preserve the intended destination
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.role !== role) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-cyan-900 text-gray-900 dark:text-white">
      <Router basename={import.meta.env.PUBLIC_URL}>
        {/* Added basename for deployment */}
        <Navbar />
        <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<SearchJobs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />{" "}
            {/* Consider creating Register component */}
            {/* Consolidated profile routes */}
            <Route
              path="/:role/profile"
              element={
                <PrivateRoute role={user?.role}>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
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
              path="/job_seeker/edit-profile"
              element={
                <PrivateRoute role="job_seeker">
                  <EditProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/job_seeker/search"
              element={
                <PrivateRoute role="job_seeker">
                  <SearchJobs />
                </PrivateRoute>
              }
            />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App; // import React, { useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
// } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { validateToken } from "./redux/slice/authSlice";
// import Navbar from "./components/Navbar";
// import Login from "./components/Login";
// import AdminDashboard from "./components/AdminDashboard";
// import EmployerDashboard from "./components/EmployerDashboard";
// import JobSeekerDashboard from "./components/JobSeekerDashboard";
// import SearchJobs from "./components/SearchJobs";
// import ProfilePage from "./components/ProfilePage";
// import Home from "./pages/Home";

// const App = () => {
//   const dispatch = useDispatch();
//   const { user, loading } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (!user && !loading) {
//       dispatch(validateToken());
//     }
//   }, [dispatch, user, loading]);

//   const PrivateRoute = ({ children, role }) => {
//     if (loading) return <div className="text-center mt-20">Loading...</div>;
//     return user && user.role === role ? children : <Navigate to="/" />;
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-cyan-900 text-gray-900 dark:text-white">
//       <Router>
//         <Navbar />
//         <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//           <Routes>
//             <Route path="/home" element={<Home />} />
//             <Route path="/" element={<SearchJobs />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Login />} />{" "}
//             {/* Update with Register component */}
//             <Route
//               path="/job-seeker/profile"
//               element={
//                 <PrivateRoute role="job_seeker">
//                   <ProfilePage />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/employer/profile"
//               element={
//                 <PrivateRoute role="employer">
//                   <ProfilePage />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/admin/profile"
//               element={
//                 <PrivateRoute role="admin">
//                   <ProfilePage />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/admin"
//               element={
//                 <PrivateRoute role="admin">
//                   <AdminDashboard />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/employer"
//               element={
//                 <PrivateRoute role="employer">
//                   <EmployerDashboard />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/job_seeker"
//               element={
//                 <PrivateRoute role="job_seeker">
//                   <JobSeekerDashboard />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/job-seeker/search"
//               element={
//                 <PrivateRoute role="job_seeker">
//                   <SearchJobs />
//                 </PrivateRoute>
//               }
//             />
//           </Routes>
//         </main>
//       </Router>
//     </div>
//   );
// };

// export default App;
