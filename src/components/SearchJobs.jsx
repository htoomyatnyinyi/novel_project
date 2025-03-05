import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { searchJobs } from "../redux/slice/jobSeekerSlice";
import { searchJobs } from "../redux/slice/jobSeekerSlice";

const SearchJobs = () => {
  const dispatch = useDispatch();
  const { searchResults, loading, error } = useSelector(
    (state) => state.jobSeeker
  );

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(
      searchJobs({
        title: filters.title || undefined,
        location: filters.location || undefined,
        category: filters.category || undefined,
        employment_type: filters.employment_type || undefined,
        salary_min: filters.salary_min ? Number(filters.salary_min) : undefined,
        salary_max: filters.salary_max ? Number(filters.salary_max) : undefined,
        page: filters.page,
        limit: filters.limit,
      })
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Search Jobs</h2>

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
          className="p-2 border rounded"
        />
        <input
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Location"
          className="p-2 border rounded"
        />
        <input
          name="category"
          value={filters.category}
          onChange={handleChange}
          placeholder="Category"
          className="p-2 border rounded"
        />
        <select
          name="employment_type"
          value={filters.employment_type}
          onChange={handleChange}
          className="p-2 border rounded"
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
          className="p-2 border rounded"
        />
        <input
          name="salary_max"
          value={filters.salary_max}
          onChange={handleChange}
          placeholder="Maximum Salary"
          type="number"
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="md:col-span-3 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search Jobs"}
        </button>
      </form>

      {/* Results */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      <div>
        <h3 className="text-xl font-semibold mb-2">Job Results</h3>
        {searchResults.length === 0 && !loading && !error && (
          <p className="text-gray-500">
            No jobs found. Try adjusting your filters.
          </p>
        )}
        <ul className="space-y-4">
          {searchResults.map((job) => (
            <li key={job.id} className="bg-white p-4 rounded shadow">
              <h4 className="font-semibold">{job.title}</h4>
              <p>{job.company_name}</p>
              <p>Location: {job.location || "Not specified"}</p>
              <p>Employment Type: {job.employment_type}</p>
              <p>
                Salary: ${job.salary_min || "N/A"} - ${job.salary_max || "N/A"}
              </p>
              <p>Category: {job.category || "N/A"}</p>
              <p>Posted: {new Date(job.posted_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchJobs;
