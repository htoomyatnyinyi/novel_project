import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProfile,
  fetchProfile,
  updateProfile,
  deleteProfile,
  createJob,
  fetchJobs,
} from "../redux/slice/employerSlice.js";

const EmployerDashboard = () => {
  const dispatch = useDispatch();
  const { profile, jobs, loading, error } = useSelector(
    (state) => state.employer
  );

  const [profileForm, setProfileForm] = useState({
    company_name: "",
    contact_phone: "",
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    website_url: "",
    industry: "",
    company_description: "",
  });

  const [jobForm, setJobForm] = useState({
    title: "Python Developer",
    description: "Blah.. Blah",
    salary_min: "22334",
    salary_max: "34455",
    location: "Yangon",
    address: "Ba Han Township",
    employment_type: "full_time",
    category: "Technology",
    requirements: ["Blah", "Blah2", "Blah3", "Blah4"],
    responsibilities: ["Blah1", "Ha1", "h3", "h3fj", "hflakj"],
    application_deadline: "2025-05-24",
    company_logo: null,
    post_image: null,
  });

  const [requirementInput, setRequirementInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        company_name: profile.company_name || "",
        contact_phone: profile.contact_phone || "",
        address_line: profile.address_line || "",
        city: profile.city || "",
        state: profile.state || "",
        postal_code: profile.postal_code || "",
        country: profile.country || "",
        website_url: profile.website_url || "",
        industry: profile.industry || "",
        company_description: profile.company_description || "",
      });
    }
  }, [profile]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(profileForm).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (profile) dispatch(updateProfile(profileForm));
    else dispatch(createProfile(formData));
  };

  const handleDeleteProfile = () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      dispatch(deleteProfile());
    }
  };

  const handleJobChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setJobForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setJobForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setJobForm((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput],
      }));
      setRequirementInput("");
    }
  };

  const addResponsibility = () => {
    if (responsibilityInput.trim()) {
      setJobForm((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityInput],
      }));
      setResponsibilityInput("");
    }
  };

  const handleJobSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", jobForm.title);
    formData.append("description", jobForm.description);
    formData.append("salary_min", jobForm.salary_min);
    formData.append("salary_max", jobForm.salary_max);
    formData.append("location", jobForm.location);
    formData.append("address", jobForm.address);
    formData.append("employment_type", jobForm.employment_type);
    formData.append("category", jobForm.category);
    formData.append("application_deadline", jobForm.application_deadline);
    if (jobForm.company_logo)
      formData.append("company_logo", jobForm.company_logo);
    if (jobForm.post_image) formData.append("post_image", jobForm.post_image);
    jobForm.requirements.forEach((req, index) =>
      formData.append(`requirements[${index}]`, req)
    );
    jobForm.responsibilities.forEach((resp, index) =>
      formData.append(`responsibilities[${index}]`, resp)
    );
    console.log(formData, "at handlesubmit");
    dispatch(createJob(formData));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Employer Dashboard</h2>
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Profile Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Employer Profile</h3>
        <form
          onSubmit={handleProfileSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
        >
          <input
            name="company_name"
            value={profileForm.company_name}
            onChange={handleProfileChange}
            placeholder="Company Name"
            className="p-2 border rounded"
            required={!profile}
          />
          <input
            name="contact_phone"
            value={profileForm.contact_phone}
            onChange={handleProfileChange}
            placeholder="Contact Phone"
            className="p-2 border rounded"
            required={!profile}
          />
          <input
            name="address_line"
            value={profileForm.address_line}
            onChange={handleProfileChange}
            placeholder="Address Line"
            className="p-2 border rounded"
          />
          <input
            name="city"
            value={profileForm.city}
            onChange={handleProfileChange}
            placeholder="City"
            className="p-2 border rounded"
          />
          <input
            name="state"
            value={profileForm.state}
            onChange={handleProfileChange}
            placeholder="State"
            className="p-2 border rounded"
          />
          <input
            name="postal_code"
            value={profileForm.postal_code}
            onChange={handleProfileChange}
            placeholder="Postal Code"
            className="p-2 border rounded"
          />
          <input
            name="country"
            value={profileForm.country}
            onChange={handleProfileChange}
            placeholder="Country"
            className="p-2 border rounded"
          />
          <input
            name="website_url"
            value={profileForm.website_url}
            onChange={handleProfileChange}
            placeholder="Website URL"
            className="p-2 border rounded"
          />
          <input
            name="industry"
            value={profileForm.industry}
            onChange={handleProfileChange}
            placeholder="Industry"
            className="p-2 border rounded"
          />
          <textarea
            name="company_description"
            value={profileForm.company_description}
            onChange={handleProfileChange}
            placeholder="Company Description"
            className="p-2 border rounded col-span-2"
            rows="3"
          />
          <div className="col-span-2 flex space-x-4">
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              {profile ? "Update Profile" : "Create Profile"}
            </button>
            {profile && (
              <button
                type="button"
                onClick={handleDeleteProfile}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={loading}
              >
                Delete Profile
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Job Posting Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Post a Job</h3>
        <form
          onSubmit={handleJobSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="title"
            value={jobForm.title}
            onChange={handleJobChange}
            placeholder="Job Title"
            className="p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={jobForm.description}
            onChange={handleJobChange}
            placeholder="Description"
            className="p-2 border rounded col-span-2"
            rows="3"
            required
          />
          <input
            name="salary_min"
            value={jobForm.salary_min}
            onChange={handleJobChange}
            placeholder="Minimum Salary"
            type="number"
            className="p-2 border rounded"
          />
          <input
            name="salary_max"
            value={jobForm.salary_max}
            onChange={handleJobChange}
            placeholder="Maximum Salary"
            type="number"
            className="p-2 border rounded"
          />
          <input
            name="location"
            value={jobForm.location}
            onChange={handleJobChange}
            placeholder="Location"
            className="p-2 border rounded"
          />
          <input
            name="address"
            value={jobForm.address}
            onChange={handleJobChange}
            placeholder="Address"
            className="p-2 border rounded"
          />
          <select
            name="employment_type"
            value={jobForm.employment_type}
            onChange={handleJobChange}
            className="p-2 border rounded"
          >
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="apprenticeship">Apprenticeship</option>
          </select>
          <input
            name="category"
            value={jobForm.category}
            onChange={handleJobChange}
            placeholder="Category"
            className="p-2 border rounded"
          />
          <input
            name="application_deadline"
            value={jobForm.application_deadline}
            onChange={handleJobChange}
            placeholder="Application Deadline (YYYY-MM-DD)"
            type="date"
            className="p-2 border rounded"
          />
          <div>
            <label className="block mb-1">Company Logo</label>
            <input
              name="company_logo"
              type="file"
              onChange={handleJobChange}
              accept="image/*"
              className="p-2"
            />
          </div>
          <div>
            <label className="block mb-1">Post Image</label>
            <input
              name="post_image"
              type="file"
              onChange={handleJobChange}
              accept="image/*"
              className="p-2"
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1">Requirements</label>
            <div className="flex mb-2">
              <input
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                placeholder="Add a requirement"
                className="p-2 border rounded flex-grow"
              />
              <button
                type="button"
                onClick={addRequirement}
                className="p-2 bg-green-500 text-white rounded ml-2"
              >
                Add
              </button>
            </div>
            <ul>
              {jobForm.requirements.map((req, index) => (
                <li key={index} className="mb-1 flex justify-between">
                  {req}
                  <button
                    onClick={() =>
                      setJobForm({
                        ...jobForm,
                        requirements: jobForm.requirements.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2">
            <label className="block mb-1">Responsibilities</label>
            <div className="flex mb-2">
              <input
                value={responsibilityInput}
                onChange={(e) => setResponsibilityInput(e.target.value)}
                placeholder="Add a responsibility"
                className="p-2 border rounded flex-grow"
              />
              <button
                type="button"
                onClick={addResponsibility}
                className="p-2 bg-green-500 text-white rounded ml-2"
              >
                Add
              </button>
            </div>
            <ul>
              {jobForm.responsibilities.map((resp, index) => (
                <li key={index} className="mb-1 flex justify-between">
                  {resp}
                  <button
                    onClick={() =>
                      setJobForm({
                        ...jobForm,
                        responsibilities: jobForm.responsibilities.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="submit"
            className="col-span-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            Post Job
          </button>
        </form>
      </div>

      {/* Jobs List */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Posted Jobs</h3>
        <ul className="mt-4">
          {jobs.map((job) => (
            <li key={job.id} className="mb-2">
              {job.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployerDashboard;
