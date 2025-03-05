import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  applyJob,
  saveJobThunk,
  searchJobsThunk,
} from "../redux/slice/jobSeekerSlice.js";

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { searchResults, error } = useSelector((state) => state.jobSeeker);
  const job = searchResults.find((job) => job.id === Number(id));

  useEffect(() => {
    if (!job) {
      // Fetch job details if not already in searchResults
      dispatch(searchJobsThunk({ id }));
    }
  }, [dispatch, id, job]);

  const handleApply = () => {
    dispatch(applyJob({ id, data: {} }));
  };

  const handleSave = () => {
    dispatch(saveJobThunk(id));
  };

  if (!job) return <div className="p-6">Loading job details...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">{job.title}</h2>
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      <div className="bg-white p-4 rounded shadow">
        <p>
          <strong>Company:</strong> {job.company_name}
        </p>
        <p>
          <strong>Location:</strong> {job.location || "Not specified"}
        </p>
        <p>
          <strong>Employment Type:</strong> {job.employment_type}
        </p>
        <p>
          <strong>Salary:</strong> ${job.salary_min || "N/A"} - $
          {job.salary_max || "N/A"}
        </p>
        <p>
          <strong>Description:</strong> {job.description}
        </p>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Apply
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
