import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, logoutUser } from "../redux/slice/authSlice";
import Theme from "../hooks/utils/Theme";
import { AiFillExperiment, AiOutlineUser } from "react-icons/ai";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile dropdown toggle
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Login dropdown toggle
  const [isSignupOpen, setIsSignupOpen] = useState(false); // Signup dropdown toggle

  const { user, loading, error } = useSelector((state) => state.auth);

  // Refs for form inputs
  const loginEmailRef = useRef(null);
  const loginPasswordRef = useRef(null);
  const signupNameRef = useRef(null);
  const signupEmailRef = useRef(null);
  const signupPasswordRef = useRef(null);

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

    // Add event listener when any dropdown is open
    if (isLoginOpen || isSignupOpen || isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLoginOpen, isSignupOpen, isProfileOpen]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    setIsProfileOpen(false);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = loginEmailRef.current.value;
    const password = loginPasswordRef.current.value;
    dispatch(loginUser({ email, password })).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        const role = result.payload.role;
        navigate(`/${role}`);
        setIsLoginOpen(false);
        loginEmailRef.current.value = "";
        loginPasswordRef.current.value = "";
      }
    });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const name = signupNameRef.current.value;
    const email = signupEmailRef.current.value;
    const password = signupPasswordRef.current.value;
    console.log("Signup:", { name, email, password });
    // Replace with: dispatch(registerUser({ name, email, password }));
    setIsSignupOpen(false);
    signupNameRef.current.value = "";
    signupEmailRef.current.value = "";
    signupPasswordRef.current.value = "";
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-cyan-800 to-cyan-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              {/* <AiFillExperiment className="h-8 w-8 text-cyan-300" /> */}
              <span className="text-lg font-semibold tracking-wide hidden sm:block border-b-4 border-b-cyan-500">
                Job Diary
              </span>
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
                {/* Profile Info with Dropdown */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-sm font-medium hover:text-cyan-300 transition-colors duration-200 focus:outline-none"
                >
                  <AiOutlineUser className="h-5 w-5" />
                  <span>{user.name || "Profile"}</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-cyan-800 rounded-md shadow-lg py-1 animate-slide-in">
                    {/* Profile Info Section */}
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
                    {/* Menu Options */}
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
                {/* Login Dropdown */}
                <div className="relative" ref={loginDropdownRef}>
                  <button
                    onClick={() => setIsLoginOpen(!isLoginOpen)}
                    className="text-sm font-medium hover:text-cyan-300 transition-colors duration-200 focus:outline-none"
                  >
                    Login
                  </button>
                  {isLoginOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-cyan-800 rounded-md shadow-lg p-4 animate-slide-in">
                      <h3 className="text-lg font-semibold mb-2">Sign In</h3>
                      <form onSubmit={handleLoginSubmit}>
                        <div className="mb-2">
                          <input
                            type="email"
                            placeholder="Email"
                            ref={loginEmailRef}
                            className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                          />
                        </div>
                        <div className="mb-2">
                          <input
                            type="password"
                            placeholder="Password"
                            ref={loginPasswordRef}
                            className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                          />
                        </div>
                        {loading && (
                          <p className="text-sm text-gray-300">Logging in...</p>
                        )}
                        {error && (
                          <p className="text-sm text-red-400">{error}</p>
                        )}
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:bg-gray-500"
                        >
                          Sign In
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Signup Dropdown */}
                <div className="relative" ref={signupDropdownRef}>
                  <button
                    onClick={() => setIsSignupOpen(!isSignupOpen)}
                    className="text-sm font-medium hover:text-cyan-300 transition-colors duration-200 focus:outline-none"
                  >
                    No account? Register
                  </button>
                  {isSignupOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-cyan-800 rounded-md shadow-lg p-4 animate-slide-in">
                      <h3 className="text-lg font-semibold mb-2">Sign Up</h3>
                      <form onSubmit={handleSignupSubmit}>
                        <div className="mb-2">
                          <input
                            type="text"
                            placeholder="Name"
                            ref={signupNameRef}
                            className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                          />
                        </div>
                        <div className="mb-2">
                          <input
                            type="email"
                            placeholder="Email"
                            ref={signupEmailRef}
                            className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                          />
                        </div>
                        <div className="mb-2">
                          <input
                            type="password"
                            placeholder="Password"
                            ref={signupPasswordRef}
                            className="w-full px-3 py-2 rounded-md bg-cyan-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          Sign Up
                        </button>
                      </form>
                    </div>
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
            >
              <span className="sr-only">Toggle menu</span>
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

      {/* Mobile Menu with Slide-in Animation */}
      {isOpen && (
        <div className="md:hidden animate-slide-in bg-cyan-900">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/"
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
    </nav>
  );
};

export default Navbar;
