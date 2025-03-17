import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {
  createProfile,
  fetchProfile,
  updateProfile,
  createResume,
  fetchResumes,
  deleteResume,
  createSavedJob,
  fetchSavedJobs,
  deleteSavedJob,
  createApplication,
  fetchApplications,
  deleteApplication,
  searchJobs,
  fetchJobDetails,
  fetchfileResume,
  clearFileUrl,
} from "../redux/slice/jobSeekerSlice.js";

// Set up pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const JobSeekerDashboard = () => {
  const dispatch = useDispatch();
  const {
    profile,
    resumes,
    fileUrl,
    savedJobs,
    applications,
    searchResults,
    jobDetails,
    loading,
    error,
  } = useSelector((state) => state.jobSeeker);

  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    location: "",
    bio: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [previewResumeId, setPreviewResumeId] = useState(null); // Track which resume to preview
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchResumes());
    dispatch(fetchSavedJobs());
    dispatch(fetchApplications());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
        date_of_birth: formatDateForInput(profile.date_of_birth) || "",
        location: profile.location || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (profileForm.date_of_birth) {
      const date = new Date(profileForm.date_of_birth);
      if (date > new Date()) {
        alert("Date of birth cannot be in the future");
        return;
      }
    }
    if (profile) dispatch(updateProfile(profileForm));
    else dispatch(createProfile(profileForm));
  };

  const handleSearch = () => {
    dispatch(searchJobs({ title: searchTerm }));
  };

  const handleResumeSubmit = (e) => {
    e.preventDefault();
    if (resumeFile) {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      dispatch(createResume(formData));
      setResumeFile(null);
    }
  };

  const handleSaveJob = (jobId) => {
    dispatch(createSavedJob(jobId));
  };

  const handleApply = (jobId) => {
    dispatch(createApplication({ job_post_id: jobId }));
  };

  const handleViewJobDetails = (jobId) => {
    setSelectedJobId(jobId);
    dispatch(fetchJobDetails(jobId));
  };

  const handlePreviewResume = (resumeId, filename) => {
    if (previewResumeId === resumeId) {
      // Toggle off preview
      setPreviewResumeId(null);
      dispatch(clearFileUrl());
      setNumPages(null);
    } else {
      // Fetch and preview the resume
      setPreviewResumeId(resumeId);
      dispatch(fetchfileResume(filename));
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-cyan-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Job Seeker Dashboard
        </h2>

        {/* Navigation Links */}
        {profile && (
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link
              to="/job-seeker/search"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Search Jobs
            </Link>
            <Link
              to="/job-seeker/profile"
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
            >
              View Full Profile
            </Link>
          </div>
        )}

        {/* Profile Summary */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Profile Summary
            </h3>
            {profile && (
              <Link
                to="/job-seeker/edit-profile"
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Edit Profile
              </Link>
            )}
          </div>
          {profile ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Full Name
                </p>
                <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                  {profile.first_name} {profile.last_name}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Phone
                </p>
                <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                  {profile.phone}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Location
                </p>
                <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                  {profile.location || "Not specified"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Bio
                </p>
                <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white truncate">
                  {profile.bio || "Not specified"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              Create your profile below to get started.
            </p>
          )}
        </div>

        {/* Profile Form */}
        {!profile && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Create Profile
            </h3>
            <form
              onSubmit={handleProfileSubmit}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2"
            >
              <input
                value={profileForm.first_name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, first_name: e.target.value })
                }
                placeholder="First Name"
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 w-full"
              />
              <input
                value={profileForm.last_name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, last_name: e.target.value })
                }
                placeholder="Last Name"
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 w-full"
              />
              <input
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value })
                }
                placeholder="Phone"
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 w-full"
              />
              <select
                value={profileForm.gender}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, gender: e.target.value })
                }
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                type="date"
                value={profileForm.date_of_birth}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    date_of_birth: e.target.value,
                  })
                }
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 w-full"
              />
              <input
                value={profileForm.location}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, location: e.target.value })
                }
                placeholder="Location"
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 w-full"
              />
              <textarea
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, bio: e.target.value })
                }
                placeholder="Bio"
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 w-full sm:col-span-2"
                rows="4"
              />
              <button
                type="submit"
                className="p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:col-span-2"
              >
                Create Profile
              </button>
            </form>
          </div>
        )}

        {/* Resume Upload and Preview */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Manage Resumes
          </h3>
          <form
            onSubmit={handleResumeSubmit}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <input
              type="file"
              onChange={(e) => setResumeFile(e.target.files[0])}
              accept=".pdf,.doc,.docx"
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white w-full sm:w-auto"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Upload Resume
            </button>
          </form>
          {error && <p className="text-red-500 mb-4">Error: {error}</p>}
          <ul className="space-y-4">
            {resumes.map((resume) => (
              <li
                key={resume.id}
                className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
                  <span className="text-gray-900 dark:text-white mb-2 sm:mb-0">
                    {resume.file_name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handlePreviewResume(resume.id, resume.file_name)
                      }
                      disabled={loading && previewResumeId === resume.id}
                      className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ${
                        loading && previewResumeId === resume.id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {previewResumeId === resume.id
                        ? loading
                          ? "Loading..."
                          : "Close"
                        : "Preview"}
                    </button>
                    <button
                      onClick={() => dispatch(deleteResume(resume.id))}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {previewResumeId === resume.id && fileUrl && (
                  <div className="mt-4 border border-gray-300 shadow-md p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <Document
                      file={fileUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={(error) =>
                        console.error("PDF Load Error:", error)
                      }
                      loading={<p className="text-gray-500">Loading PDF...</p>}
                      error={
                        <p className="text-red-500">
                          Failed to load PDF. Check the file.
                        </p>
                      }
                    >
                      {numPages &&
                        Array.from(new Array(numPages), (el, index) => (
                          <Page
                            key={index}
                            pageNumber={index + 1}
                            className="mb-4"
                          />
                        ))}
                    </Document>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Job Search */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Search Jobs
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Jobs"
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 w-full"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Search
            </button>
          </div>
          <ul className="space-y-4">
            {searchResults.map((job) => (
              <li
                key={job.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="mb-2 sm:mb-0">
                    <span className="text-gray-900 dark:text-white font-medium">
                      {job.title}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {job.company_name}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleViewJobDetails(job.id)}
                      className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleApply(job.id)}
                      className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => handleSaveJob(job.id)}
                      className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition duration-300"
                    >
                      Save
                    </button>
                  </div>
                </div>
                {selectedJobId === job.id && jobDetails && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Job Details
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {jobDetails.description}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Location: {jobDetails.location}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Salary: {jobDetails.salary || "Not specified"}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Saved Jobs */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Saved Jobs
          </h3>
          <ul className="space-y-4">
            {savedJobs.map((job) => (
              <li
                key={job.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-gray-900 dark:text-white mb-2 sm:mb-0">
                  {job.title}
                </span>
                <button
                  onClick={() => dispatch(deleteSavedJob(job.id))}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Applications */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Applications
          </h3>
          <ul className="space-y-4">
            {applications.map((app) => (
              <li
                key={app.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-gray-900 dark:text-white mb-2 sm:mb-0">
                  {app.title} -{" "}
                  <span className="capitalize text-gray-600 dark:text-gray-300">
                    {app.status}
                  </span>
                </span>
                <button
                  onClick={() => dispatch(deleteApplication(app.id))}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
