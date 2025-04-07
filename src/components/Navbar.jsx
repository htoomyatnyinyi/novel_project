import React, { useState, useRef, useEffect } from "react";
import Theme from "../hooks/utils/Theme";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { loginUser, logoutUser } from "../redux/slice/authSlice";
import { registerUser } from "../redux/slice/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "/genetic-test-report-svgrepo-com.svg";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile dropdown toggle
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Login dropdown toggle
  const [isSignupOpen, setIsSignupOpen] = useState(false); // Signup dropdown toggle

  const { user, loading, error } = useSelector((state) => state.auth);

  // Refs for dropdown elements
  const loginDropdownRef = useRef(null);
  const signupDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(event.target)
      ) {
        setIsLoginOpen(false);
      }
      if (
        signupDropdownRef.current &&
        !signupDropdownRef.current.contains(event.target)
      ) {
        setIsSignupOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isLoginOpen || isSignupOpen || isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLoginOpen, isSignupOpen, isProfileOpen]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    setIsProfileOpen(false);
    toast.success("Logged out successfully");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 dark:bg-gradient-to-l bg-gradient-to-r from-cyan-800 to-cyan-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <img src={Logo} alt="learning" className="h-10 w-10 p-2" />
            </Link>
            <Theme />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/home"
              className="text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/job_seeker/search"
              className="text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
            >
              Search Jobs
            </Link>
            {user ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-sm font-medium hover:text-cyan-300 transition-colors duration-200 focus:outline-none"
                >
                  <AiOutlineUser className="h-5 w-5" />
                  <span>{user.name || "Profile"}</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-cyan-800 rounded-md shadow-lg py-1 animate-slide-in">
                    <div className="px-4 py-2 border-b border-cyan-700">
                      <p className="text-sm font-semibold">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-300">
                        {user.email || "No email"}
                      </p>
                      <p className="text-xs text-gray-300 capitalize">
                        Role: {user.role}
                      </p>
                    </div>
                    <Link
                      to={`/${user.role}/profile`}
                      className="block px-4 py-2 text-sm hover:bg-cyan-700 transition-colors duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to={`/${user.role}`}
                      className="block px-4 py-2 text-sm hover:bg-cyan-700 transition-colors duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-red-600 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="relative" ref={loginDropdownRef}>
                  <button
                    onClick={() => setIsLoginOpen(!isLoginOpen)}
                    className="text-sm font-medium hover:text-cyan-300 transition-colors duration-200 focus:outline-none"
                  >
                    Login
                  </button>
                  {isLoginOpen && (
                    <LoginForm onClose={() => setIsLoginOpen(false)} />
                  )}
                </div>
                <div className="relative" ref={signupDropdownRef}>
                  <button
                    onClick={() => setIsSignupOpen(!isSignupOpen)}
                    className="text-sm font-medium hover:text-cyan-300 transition-colors duration-200 focus:outline-none"
                  >
                    No account? Please Register
                  </button>
                  {isSignupOpen && (
                    <SignupForm onClose={() => setIsSignupOpen(false)} />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-cyan-300 hover:bg-cyan-700 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {!isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden animate-slide-in bg-cyan-900">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/home"
              className="block text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/job_seeker/search"
              className="block text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Search Jobs
            </Link>
            {user ? (
              <>
                <Link
                  to={`/${user.role}/profile`}
                  className="block text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {user.name || "Profile"}
                </Link>
                <Link
                  to={`/${user.role}`}
                  className="block text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard ({user.role})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  No account? Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </nav>
  );
};

// LoginForm Component
const LoginForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }

    dispatch(loginUser({ email, password })).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Login successful");
        const role = result.payload.role;
        navigate(`/${role}`);
        onClose();
        emailRef.current.value = "";
        passwordRef.current.value = "";
      } else {
        toast.error(result.payload || "Login failed");
      }
    });
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-cyan-800 rounded-md shadow-lg p-4 animate-slide-in">
      <h3 className="text-lg font-semibold mb-2">Sign In</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email}</p>
          )}
        </div>
        <div className="mb-2">
          <input
            type="password"
            placeholder="Password"
            ref={passwordRef}
            className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password}</p>
          )}
        </div>
        {loading && <p className="text-sm text-gray-300">Logging in...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:bg-gray-500"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

// SignupForm Component
const SignupForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (!username) {
      setErrors((prev) => ({ ...prev, username: "Username is required" }));
      return;
    }
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }
    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    dispatch(registerUser({ username, email, password, confirmPassword })).then(
      (result) => {
        if (result.meta.requestStatus === "fulfilled") {
          toast.success("Signup successful");
          onClose();
          usernameRef.current.value = "";
          emailRef.current.value = "";
          passwordRef.current.value = "";
          confirmPasswordRef.current.value = "";
        } else {
          toast.error(result.payload || "Signup failed");
        }
      }
    );
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-cyan-800 rounded-md shadow-lg p-4 animate-slide-in">
      <h3 className="text-lg font-semibold mb-2">Register Form</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Username"
            ref={usernameRef}
            className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          {errors.username && (
            <p className="text-sm text-red-400">{errors.username}</p>
          )}
        </div>
        <div className="mb-2">
          <input
            type="email"
            placeholder="example@diary.com"
            // placeholder="Email"
            ref={emailRef}
            className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email}</p>
          )}
        </div>
        <div className="mb-2">
          <input
            type="password"
            placeholder="Password"
            ref={passwordRef}
            className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password}</p>
          )}
        </div>
        <div className="mb-2">
          <input
            type="password"
            placeholder="Confirm Password"
            ref={confirmPasswordRef}
            className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-400">{errors.confirmPassword}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:bg-gray-500"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <p className="p-2 mt-8">
        For Employer Please Click This Link{" "}
        <Link to="/register" className="underline">
          Here
        </Link>
      </p>
    </div>
  );
};

export default Navbar;
// import React, { useState, useRef, useEffect } from "react";
// import Theme from "../hooks/utils/Theme";
// import { useSelector, useDispatch } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { AiOutlineUser } from "react-icons/ai";
// import { loginUser, logoutUser } from "../redux/slice/authSlice";
// import { registerUser } from "../redux/slice/authSlice";

// import Logo from "../assets/genetic-test-report-svgrepo-com.svg";

// const Navbar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
//   const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile dropdown toggle
//   const [isLoginOpen, setIsLoginOpen] = useState(false); // Login dropdown toggle
//   const [isSignupOpen, setIsSignupOpen] = useState(false); // Signup dropdown toggle

//   const { user, loading, error } = useSelector((state) => state.auth);

//   // Refs for form inputs
//   const loginEmailRef = useRef(null);
//   const loginPasswordRef = useRef(null);
//   // // old version
//   // const signupNameRef = useRef(null);
//   // const signupEmailRef = useRef(null);
//   // const signupPasswordRef = useRef(null);
//   // new version
//   const usernameRef = useRef(null);
//   const emailRef = useRef(null);
//   const passwordRef = useRef(null);
//   // const confirmPasswrodRef = useRef(null);

//   // Refs for dropdown elements
//   const loginDropdownRef = useRef(null);
//   const signupDropdownRef = useRef(null);
//   const profileDropdownRef = useRef(null);

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         loginDropdownRef.current &&
//         !loginDropdownRef.current.contains(event.target)
//       ) {
//         setIsLoginOpen(false);
//       }
//       if (
//         signupDropdownRef.current &&
//         !signupDropdownRef.current.contains(event.target)
//       ) {
//         setIsSignupOpen(false);
//       }
//       if (
//         profileDropdownRef.current &&
//         !profileDropdownRef.current.contains(event.target)
//       ) {
//         setIsProfileOpen(false);
//       }
//     };

//     // Add event listener when any dropdown is open
//     if (isLoginOpen || isSignupOpen || isProfileOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     // Cleanup event listener
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isLoginOpen, isSignupOpen, isProfileOpen]);

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     navigate("/");
//     setIsProfileOpen(false);
//   };

//   const handleLoginSubmit = (e) => {
//     e.preventDefault();
//     const email = loginEmailRef.current.value;
//     const password = loginPasswordRef.current.value;
//     dispatch(loginUser({ email, password })).then((result) => {
//       if (result.meta.requestStatus === "fulfilled") {
//         const role = result.payload.role;
//         navigate(`/${role}`);
//         setIsLoginOpen(false);
//         loginEmailRef.current.value = "";
//         loginPasswordRef.current.value = "";
//       }
//     });
//   };

//   const handleSignupSubmit = (e) => {
//     e.preventDefault();
//     const username = usernameRef.current.value;
//     const email = emailRef.current.value;
//     const password = passwordRef.current.value;
//     console.log("Signup:", { username, email, password });
//     dispatch(registerUser({ username, email, password }));
//     setIsSignupOpen(false);

//     usernameRef.current.value = "";
//     emailRef.current.value = "";
//     passwordRef.current.value = "";
//   };

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 dark:bg-gradient-to-l bg-gradient-to-r from-cyan-800 to-cyan-900 text-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <Link to="/" className="flex items-center space-x-2">
//               {/* <AiFillExperiment className="h-8 w-8 text-cyan-300" /> */}
//               <img src={Logo} alt="learning" className="h-10 w-10  p-2 " />
//               {/* <span className="text-lg font-semibold tracking-wide hidden sm:block border-b-4 border-b-cyan-500">
//                 Job Diary
//               </span> */}
//             </Link>
//             <Theme />
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-6">
//             <Link
//               to="/home"
//               className="text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
//             >
//               Home
//             </Link>
//             <Link
//               to="/job_seeker/search"
//               className="text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
//             >
//               Search Jobs
//             </Link>
//             {user ? (
//               <div className="relative" ref={profileDropdownRef}>
//                 {/* Profile Info with Dropdown */}
//                 <button
//                   onClick={() => setIsProfileOpen(!isProfileOpen)}
//                   className="flex items-center space-x-2 text-sm font-medium hover:text-cyan-300 transition-colors duration-200 focus:outline-none"
//                 >
//                   <AiOutlineUser className="h-5 w-5" />
//                   <span>{user.name || "Profile"}</span>
//                 </button>
//                 {isProfileOpen && (
//                   <div className="absolute right-0 mt-2 w-64 bg-cyan-800 rounded-md shadow-lg py-1 animate-slide-in">
//                     {/* Profile Info Section */}
//                     <div className="px-4 py-2 border-b border-cyan-700">
//                       <p className="text-sm font-semibold">
//                         {user.name || "User"}
//                       </p>
//                       <p className="text-xs text-gray-300">
//                         {user.email || "No email"}
//                       </p>
//                       <p className="text-xs text-gray-300 capitalize">
//                         Role: {user.role}
//                       </p>
//                     </div>
//                     {/* Menu Options */}
//                     <Link
//                       to={`/${user.role}/profile`}
//                       className="block px-4 py-2 text-sm hover:bg-cyan-700 transition-colors duration-200"
//                       onClick={() => setIsProfileOpen(false)}
//                     >
//                       Profile
//                     </Link>
//                     <Link
//                       to={`/${user.role}`}
//                       className="block px-4 py-2 text-sm hover:bg-cyan-700 transition-colors duration-200"
//                       onClick={() => setIsProfileOpen(false)}
//                     >
//                       Dashboard
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full text-left px-4 py-2 text-sm hover:bg-red-600 transition-colors duration-200"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <>
//                 {/* Login Dropdown */}
//                 <div className="relative" ref={loginDropdownRef}>
//                   <button
//                     onClick={() => setIsLoginOpen(!isLoginOpen)}
//                     className="text-sm font-medium hover:text-cyan-300 transition-colors duration-200 focus:outline-none"
//                   >
//                     Login
//                   </button>
//                   {isLoginOpen && (
//                     <div className="absolute right-0 mt-2 w-64 bg-cyan-800 rounded-md shadow-lg p-4 animate-slide-in">
//                       <h3 className="text-lg font-semibold mb-2">Sign In</h3>
//                       <form onSubmit={handleLoginSubmit}>
//                         <div className="mb-2">
//                           <input
//                             type="email"
//                             placeholder="Email"
//                             ref={loginEmailRef}
//                             className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
//                           />
//                         </div>
//                         <div className="mb-2">
//                           <input
//                             type="password"
//                             placeholder="Password"
//                             ref={loginPasswordRef}
//                             className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
//                           />
//                         </div>
//                         {loading && (
//                           <p className="text-sm text-gray-300">Logging in...</p>
//                         )}
//                         {error && (
//                           <p className="text-sm text-red-400">{error}</p>
//                         )}
//                         <button
//                           type="submit"
//                           disabled={loading}
//                           className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:bg-gray-500"
//                         >
//                           Sign In
//                         </button>
//                       </form>
//                       <button
//                         onClick={() => console.log("Click")}
//                         className="text-sm mt-8"
//                       >
//                         No Account Register Heree!
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Signup Dropdown Edit Version */}
//                 <div className="relative" ref={signupDropdownRef}>
//                   <button
//                     onClick={() => setIsSignupOpen(!isSignupOpen)}
//                     className="text-sm font-medium hover:text-cyan-300 transition-colors duration-200 focus:outline-none"
//                   >
//                     No account? Please Register
//                   </button>
//                   {isSignupOpen && (
//                     <div className="absolute right-0 mt-2 w-64 bg-cyan-800 rounded-md shadow-lg p-4 animate-slide-in">
//                       <h3 className="text-lg font-semibold mb-2">
//                         Register Form
//                       </h3>
//                       <form onSubmit={handleSignupSubmit}>
//                         <div className="mb-2">
//                           <input
//                             type="text"
//                             placeholder="Username"
//                             ref={usernameRef}
//                             className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
//                           />
//                         </div>
//                         <div className="mb-2">
//                           <input
//                             type="email"
//                             placeholder="Email"
//                             ref={emailRef}
//                             className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
//                           />
//                         </div>
//                         <div className="mb-2">
//                           <input
//                             type="password"
//                             placeholder="Password"
//                             ref={passwordRef}
//                             className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
//                           />
//                         </div>
//                         <button
//                           type="submit"
//                           className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
//                         >
//                           Sign Up
//                         </button>
//                       </form>
//                       <p className="p-2 mt-8">
//                         For Employer Please Click This Link{" "}
//                         <Link to="/register" className="underline">
//                           Here
//                         </Link>
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="p-2 rounded-md text-cyan-300 hover:bg-cyan-700 transition-colors duration-200"
//             >
//               <span className="sr-only">Toggle menu</span>
//               {!isOpen ? (
//                 <svg
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu with Slide-in Animation */}
//       {isOpen && (
//         <div className="md:hidden animate-slide-in bg-cyan-900">
//           <div className="px-4 pt-2 pb-4 space-y-2">
//             <Link
//               to="/home"
//               className="block text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
//               onClick={() => setIsOpen(false)}
//             >
//               Home
//             </Link>
//             <Link
//               to="/job_seeker/search"
//               className="block text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
//               onClick={() => setIsOpen(false)}
//             >
//               Search Jobs
//             </Link>
//             {user ? (
//               <>
//                 <Link
//                   to={`/${user.role}/profile`}
//                   className="block text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {user.name || "Profile"}
//                 </Link>
//                 <Link
//                   to={`/${user.role}`}
//                   className="block text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Dashboard ({user.role})
//                 </Link>
//                 <button
//                   onClick={() => {
//                     handleLogout();
//                     setIsOpen(false);
//                   }}
//                   className="block w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   className="block text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="block text-sm font-medium hover:text-cyan-300 transition-colors duration-200"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   No account? Register
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
