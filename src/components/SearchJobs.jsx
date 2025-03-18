import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobDetails,
  searchJobs,
  createSavedJob,
  fetchSavedJobs,
  deleteSavedJob,
  createApplication,
  fetchApplications,
  deleteApplication,
} from "../redux/slice/jobSeekerSlice";

const SearchJobs = () => {
  const dispatch = useDispatch();
  const {
    searchResults,
    jobDetails,
    savedJobs,
    applications,
    totalJobs,
    loading,
    error,
  } = useSelector((state) => state.jobSeeker);

  // Assume auth slice holds user data; adjust path based on your store structure
  const { user } = useSelector((state) => state.auth || {}); // Adjust 'auth' to your actual slice name
  const isJobSeeker = user?.role === "job_seeker"; // Check if user is a job seeker

  const [filters, setFilters] = useState({
    title: "",
    location: "",
    category: "",
    employment_type: "",
    salary_min: "",
    salary_max: "",
    page: 1,
    limit: 10,
  });

  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
  const [showSavedJobs, setShowSavedJobs] = useState(false);
  const [showApplications, setShowApplications] = useState(false);

  useEffect(() => {
    if (isJobSeeker) {
      dispatch(fetchSavedJobs());
      dispatch(fetchApplications());
    }
    dispatch(searchJobs(filters)); // Initial search for all roles
  }, [dispatch, isJobSeeker]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchJobs(filters));
    setIsMobileDetailsOpen(false);
  };

  const handleFetchJobDetails = (jobId) => {
    dispatch(fetchJobDetails(jobId));
    setIsMobileDetailsOpen(true);
  };

  const handleSaveJob = (jobId) => {
    dispatch(createSavedJob(jobId));
  };

  const handleApply = (jobId) => {
    dispatch(createApplication({ job_post_id: jobId }));
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some((savedJob) => savedJob.id === jobId);
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    dispatch(searchJobs({ ...filters, page: newPage }));
  };

  const totalPages = Math.ceil(totalJobs / filters.limit);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Search Jobs
      </h2>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <input
          name="title"
          value={filters.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
        <input
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Location"
          className="p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
        <input
          name="category"
          value={filters.category}
          onChange={handleChange}
          placeholder="Category"
          className="p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
        <select
          name="employment_type"
          value={filters.employment_type}
          onChange={handleChange}
          className="p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
        >
          <option value="">Select Employment Type</option>
          <option value="full_time">Full Time</option>
          <option value="part_time">Part Time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
          <option value="apprenticeship">Apprenticeship</option>
        </select>
        <input
          name="salary_min"
          value={filters.salary_min}
          onChange={handleChange}
          placeholder="Minimum Salary"
          type="number"
          className="p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
        <input
          name="salary_max"
          value={filters.salary_max}
          onChange={handleChange}
          placeholder="Maximum Salary"
          type="number"
          className="p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
        <button
          type="submit"
          className="md:col-span-3 p-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors duration-200 disabled:bg-gray-500"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search Jobs"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Job Results
      </h3>
      {searchResults.length === 0 && !loading && !error && (
        <p className="text-red-500 dark:text-red-400">
          No jobs found. Try adjusting your filters.
        </p>
      )}

      {/* Responsive Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Job List (Scrollable) */}
        <div className="w-full md:w-1/3">
          <div className="scrollbar-hide p-4 rounded shadow bg-white dark:bg-gray-800 max-h-[70vh] overflow-y-auto">
            <JobLists
              jobs={searchResults}
              handleFetchJobDetails={handleFetchJobDetails}
              handleSaveJob={isJobSeeker ? handleSaveJob : null} // Disable for non-job seekers
              isJobSaved={isJobSaved}
              isJobSeeker={isJobSeeker} // Pass role check
            />
          </div>
          {/* Pagination Controls */}
          {totalJobs > 0 && (
            <div className="mt-4 flex flex-col md:flex-row items-center justify-between text-gray-900 dark:text-white">
              <div className="mb-2 md:mb-0">
                Showing {(filters.page - 1) * filters.limit + 1} -{" "}
                {Math.min(filters.page * filters.limit, totalJobs)} of{" "}
                {totalJobs} jobs
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1 || loading}
                  className="p-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 disabled:bg-gray-500 transition-colors duration-200"
                >
                  Previous
                </button>
                <span className="p-2">
                  Page {filters.page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page >= totalPages || loading}
                  className="p-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 disabled:bg-gray-500 transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Job Details (Right on Web, Open Box on Mobile) */}
        <div className=" w-full md:w-2/3">
          <div className="scrollbar-hide hidden md:block p-6 rounded shadow bg-white dark:bg-gray-800 max-h-[70vh] overflow-y-auto">
            <JobDetails
              job={jobDetails}
              handleSaveJob={isJobSeeker ? handleSaveJob : null}
              handleApply={isJobSeeker ? handleApply : null}
              isJobSaved={isJobSaved}
              isJobSeeker={isJobSeeker}
            />
          </div>
          {isMobileDetailsOpen && (
            <div className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 z-50 p-4 overflow-y-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative mx-auto max-w-lg max-h-[calc(100vh-8rem)] overflow-y-auto">
                <button
                  onClick={() => setIsMobileDetailsOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                >
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
                </button>
                <JobDetails
                  job={jobDetails}
                  handleSaveJob={isJobSeeker ? handleSaveJob : null}
                  handleApply={isJobSeeker ? handleApply : null}
                  isJobSaved={isJobSaved}
                  isJobSeeker={isJobSeeker}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Saved Jobs Section - Only for Job Seekers */}
      {isJobSeeker && (
        <div className="mt-6">
          <button
            onClick={() => setShowSavedJobs(!showSavedJobs)}
            className="w-full md:w-auto p-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors duration-200"
          >
            {showSavedJobs ? "Hide Saved Jobs" : "Show Saved Jobs"}
          </button>
          {showSavedJobs && (
            <div className="mt-4 p-4 rounded shadow bg-white dark:bg-gray-800">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Saved Jobs
              </h3>
              {savedJobs.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No saved jobs yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {savedJobs.map((job) => (
                    <li
                      key={job.id}
                      className="flex justify-between items-center p-2 border-b last:border-none"
                    >
                      <span className="text-gray-900 dark:text-white">
                        {job.title}
                      </span>
                      <button
                        onClick={() => dispatch(deleteSavedJob(job.id))}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* Applications Section - Only for Job Seekers */}
      {isJobSeeker && (
        <div className="mt-6">
          <button
            onClick={() => setShowApplications(!showApplications)}
            className="w-full md:w-auto p-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors duration-200"
          >
            {showApplications ? "Hide Applications" : "Show Applications"}
          </button>
          {showApplications && (
            <div className="mt-4 p-4 rounded shadow bg-white dark:bg-gray-800">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Applications
              </h3>
              {applications.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No applications yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {applications.map((app) => (
                    <li
                      key={app.id}
                      className="flex justify-between items-center p-2 border-b last:border-none"
                    >
                      <span className="text-gray-900 dark:text-white">
                        {app.title} - {app.status}
                      </span>
                      <button
                        onClick={() => dispatch(deleteApplication(app.id))}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Job Lists Component
const JobLists = ({
  jobs,
  handleFetchJobDetails,
  handleSaveJob,
  isJobSaved,
  isJobSeeker,
}) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="p-4 text-gray-500 dark:text-gray-400">
        There are no jobs to display.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {jobs.map((job) => (
        <li
          key={job.id}
          className="p-4 border-b last:border-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <button
            className="w-full text-left"
            onClick={() => handleFetchJobDetails(job.id)}
          >
            <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
              {job.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              {job.company_name || "Unknown Company"}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Location: {job.location || "Not specified"}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Employment Type: {job.employment_type}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Salary: ${job.salary_min || "N/A"} - ${job.salary_max || "N/A"}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Category: {job.category || "N/A"}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Posted: {new Date(job.posted_at).toLocaleDateString()}
            </p>
          </button>
          {isJobSeeker && (
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleSaveJob(job.id)}
                className={`p-1 text-white rounded transition-colors duration-200 ${
                  isJobSaved(job.id)
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
                disabled={isJobSaved(job.id)}
              >
                {isJobSaved(job.id) ? "Saved" : "Save"}
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

// Job Details Component
const JobDetails = ({
  job,
  handleSaveJob,
  handleApply,
  isJobSaved,
  isJobSeeker,
}) => {
  if (!job) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-400">
        Select a job to see details.
      </div>
    );
  }

  return (
    <div className="text-gray-900 dark:text-white">
      <h2 className="text-3xl font-bold mb-4">{job.title}</h2>
      <p className="mb-2">
        <strong>Company:</strong> {job.company_name || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Location:</strong> {job.location || "Not specified"}
        {job.address && `, ${job.address}`}
      </p>
      <p className="mb-2">
        <strong>Employment Type:</strong> {job.employment_type || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Salary:</strong> ${job.salary_min || "N/A"} - $
        {job.salary_max || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Category:</strong> {job.category || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Description:</strong>{" "}
        {job.description || "No description available"}
      </p>
      <p className="mb-2">
        <strong>Posted:</strong> {new Date(job.posted_at).toLocaleDateString()}
      </p>
      {job.application_deadline && (
        <p className="mb-2">
          <strong>Application Deadline:</strong>{" "}
          {new Date(job.application_deadline).toLocaleDateString()}
        </p>
      )}
      {job.is_active !== undefined && (
        <p className="mb-2">
          <strong>Status:</strong> {job.is_active ? "Active" : "Inactive"}
        </p>
      )}

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Requirements</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          {Array.isArray(job.requirements) && job.requirements.length > 0
            ? job.requirements.map((req, index) => <li key={index}>{req}</li>)
            : "No requirements listed"}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Responsibilities</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          {Array.isArray(job.responsibilities) &&
          job.responsibilities.length > 0
            ? job.responsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))
            : "No responsibilities listed"}
        </ul>
      </div>

      {isJobSeeker && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => handleSaveJob(job.id)}
            className={`p-2 text-white rounded transition-colors duration-200 ${
              isJobSaved(job.id)
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
            disabled={isJobSaved(job.id)}
          >
            {isJobSaved(job.id) ? "Saved" : "Save Job"}
          </button>
          <button
            onClick={() => handleApply(job.id)}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
          >
            Apply Now
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchJobs;
