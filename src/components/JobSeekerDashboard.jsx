import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
} from "../redux/slice/jobSeekerSlice.js";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Converts to "yyyy-MM-dd"
};

const JobSeekerDashboard = () => {
  const dispatch = useDispatch();

  const { profile, resumes, savedJobs, applications, searchResults } =
    useSelector((state) => state.jobSeeker);

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

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchResumes());
    dispatch(fetchSavedJobs());
    dispatch(fetchApplications());
  }, [dispatch]);

  // new
  useEffect(() => {
    // Update form with existing profile data
    if (profile) {
      setProfileForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
        // date_of_birth: profile.date_of_birth || "",
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
    }
  };

  const handleSaveJob = (jobId) => {
    dispatch(createSavedJob(jobId));
  };

  const handleApply = (jobId) => {
    dispatch(createApplication({ job_post_id: jobId }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Job Seeker Dashboard</h2>
      {profile && (
        <div className="mb-6">
          <Link
            to="/job-seeker/search"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search Jobs
          </Link>
          <Link
            to="/job-seeker/profile"
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            View Profile
          </Link>
        </div>
      )}
      <form
        onSubmit={handleProfileSubmit}
        className="mb-6 grid grid-cols-2 gap-4"
      >
        <input
          value={profileForm.first_name}
          onChange={(e) =>
            setProfileForm({ ...profileForm, first_name: e.target.value })
          }
          placeholder="First Name"
          className="p-2 border rounded mr-2"
        />
        <input
          value={profileForm.last_name}
          onChange={(e) =>
            setProfileForm({ ...profileForm, last_name: e.target.value })
          }
          placeholder="Last Name"
          className="p-2 border rounded mr-2"
        />
        <input
          value={profileForm.phone}
          onChange={(e) =>
            setProfileForm({ ...profileForm, phone: e.target.value })
          }
          placeholder="Phone"
          className="p-2 border rounded mr-2"
        />
        <select
          value={profileForm.gender}
          onChange={(e) =>
            setProfileForm({ ...profileForm, gender: e.target.value })
          }
          className="p-2 border rounded"
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
            setProfileForm({ ...profileForm, date_of_birth: e.target.value })
          }
          className="p-2 border rounded"
        />
        <input
          value={profileForm.location}
          onChange={(e) =>
            setProfileForm({ ...profileForm, location: e.target.value })
          }
          placeholder="Location"
          className="p-2 border rounded"
        />
        <textarea
          value={profileForm.bio}
          onChange={(e) =>
            setProfileForm({ ...profileForm, bio: e.target.value })
          }
          placeholder="Bio"
          className="p-2 border rounded col-span-2"
          rows="4"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          {profile ? "Update Profile" : "Create Profile"}
        </button>
      </form>

      <form onSubmit={handleResumeSubmit} className="mb-6">
        <input
          type="file"
          onChange={(e) => setResumeFile(e.target.files[0])}
          className="mb-2"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Upload Resume
        </button>
      </form>
      <ul className="mb-6">
        {resumes.map((resume) => (
          <li key={resume.id} className="mb-2">
            {resume.file_name}
            <button
              onClick={() => dispatch(deleteResume(resume.id))}
              className="ml-2 p-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="mb-6">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Jobs"
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>
      <ul className="mb-6">
        {searchResults.map((job) => (
          <li key={job.id} className="mb-2">
            {job.title}
            <button
              onClick={() => handleApply(job.id)}
              className="ml-2 p-1 bg-green-500 text-white rounded"
            >
              Apply
            </button>
            <button
              onClick={() => handleSaveJob(job.id)}
              className="ml-2 p-1 bg-yellow-500 text-white rounded"
            >
              Save
            </button>
          </li>
        ))}
      </ul>

      <h3 className="text-xl mb-2">Saved Jobs</h3>
      <ul className="mb-6">
        {savedJobs.map((job, index) => (
          // <li key={job.id} className="mb-2">
          <li key={index} className="mb-2">
            {job.title}
            <button
              onClick={() => dispatch(deleteSavedJob(job.id))}
              className="ml-2 p-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h3 className="text-xl mb-2">Applications</h3>
      <ul>
        {applications.map((app) => (
          <li key={app.id} className="mb-2">
            {app.title} - {app.status}
            <button
              onClick={() => dispatch(deleteApplication(app.id))}
              className="ml-2 p-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobSeekerDashboard;
