import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaTrash,
  FaHome,
  FaUser,
  FaBriefcase,
  FaList,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  createProfile,
  fetchProfile,
  updateProfile,
  createJob,
  fetchJobs,
  updateJob,
  deleteJob,
  fetchAppliedJobs,
  fetchAnalytics,
  updateApplicationStatus,
} from "../redux/slice/employerSlice.js";

const EmployerDashboard = () => {
  const dispatch = useDispatch();
  const { profile, jobs, appliedJobs, analytics, loading, error } = useSelector(
    (state) => state.employer
  );
  // console.log(profile);
  const [activeSection, setActiveSection] = useState("overview");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null); // For My Jobs
  const [editingAppliedJobId, setEditingAppliedJobId] = useState(null); // For Applied Jobs

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    setValue,
  } = useForm({
    defaultValues: {
      company_name: "",
      contact_phone: "",
      company_description: "",
    },
  });

  // Job Form (for Post Job)
  const {
    register: registerJob,
    handleSubmit: handleJobSubmit,
    reset: resetJob,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      employment_type: "full_time",
      salary_min: "",
      salary_max: "",
      location: "",
      address: "",
      category: "",
      application_deadline: "",
    },
  });

  // Edit Job Form (for My Jobs and Applied Jobs)
  const {
    register: registerEditJob,
    handleSubmit: handleEditJobSubmit,
    setValue: setEditJobValue,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      employment_type: "full_time",
      salary_min: "",
      salary_max: "",
      location: "",
      address: "",
      category: "",
      application_deadline: "",
    },
  });

  const [jobForm, setJobForm] = useState({
    requirements: [],
    responsibilities: [],
    post_image: null,
  });
  const [editJobForm, setEditJobForm] = useState({
    requirements: [],
    responsibilities: [],
    post_image: null,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [newRequirement, setNewRequirement] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchJobs());
    dispatch(fetchAppliedJobs());
    dispatch(fetchAnalytics());
  }, [dispatch]);

  useEffect(() => {
    if (profile && !editingProfile) {
      setValue("company_name", profile.company_name);
      setValue("contact_phone", profile.contact_phone);
      setValue("company_description", profile.company_description);
    }
  }, [profile, setValue, editingProfile]);

  // Handlers
  const onProfileSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    if (logoFile) formData.append("logo", logoFile);

    const action = profile ? updateProfile(formData) : createProfile(formData);
    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(profile ? "Profile updated!" : "Profile created!");
        setEditingProfile(false);
      })
      .catch((err) => toast.error(err.message));
  };

  const onJobSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) =>
      formData.append(key, value || "")
    );
    if (jobForm.post_image) formData.append("post_image", jobForm.post_image);
    formData.append("requirements", JSON.stringify(jobForm.requirements));
    formData.append(
      "responsibilities",
      JSON.stringify(jobForm.responsibilities)
    );

    dispatch(createJob(formData))
      .unwrap()
      .then(() => {
        toast.success("Job posted!");
        setJobForm({
          requirements: [],
          responsibilities: [],
          post_image: null,
        });
        setNewRequirement("");
        setNewResponsibility("");
        resetJob();
      })
      .catch((err) => toast.error(err.message));
  };

  const onEditJobSubmit = (data, jobId, isAppliedJob = false) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) =>
      formData.append(key, value || "")
    );
    if (editJobForm.post_image)
      formData.append("post_image", editJobForm.post_image);
    formData.append("requirements", JSON.stringify(editJobForm.requirements));
    formData.append(
      "responsibilities",
      JSON.stringify(editJobForm.responsibilities)
    );

    dispatch(updateJob({ jobId, formData }))
      .unwrap()
      .then(() => {
        toast.success("Job updated!");
        if (isAppliedJob) setEditingAppliedJobId(null);
        else setEditingJobId(null);
        setEditJobForm({
          requirements: [],
          responsibilities: [],
          post_image: null,
        });
        setNewRequirement("");
        setNewResponsibility("");
      })
      .catch((err) => toast.error(err.message));
  };

  const handleEditJob = (job, isAppliedJob = false) => {
    const setId = isAppliedJob ? setEditingAppliedJobId : setEditingJobId;
    setId(job.id);
    setEditJobValue("title", job.title);
    setEditJobValue("description", job.description);
    setEditJobValue("employment_type", job.employment_type);
    setEditJobValue("salary_min", job.salary_min || "");
    setEditJobValue("salary_max", job.salary_max || "");
    setEditJobValue("location", job.location || "");
    setEditJobValue("address", job.address || "");
    setEditJobValue("category", job.category || "");
    setEditJobValue(
      "application_deadline",
      job.application_deadline ? job.application_deadline.slice(0, 10) : ""
    );
    setEditJobForm({
      requirements: job.requirements || [],
      responsibilities: job.responsibilities || [],
      post_image: null,
    });
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm("Delete this job?")) {
      dispatch(deleteJob(jobId))
        .unwrap()
        .then(() => toast.success("Job deleted!"))
        .catch((err) => toast.error(err.message));
    }
  };

  const handleStatusChange = (applicationId, status) => {
    dispatch(updateApplicationStatus({ applicationId, status }))
      .unwrap()
      .then(() => toast.success("Status updated!"))
      .catch((err) => toast.error(err.message));
  };

  // Add/Delete Handlers for Requirements and Responsibilities
  const addRequirement = (formType) => {
    if (newRequirement.trim()) {
      if (formType === "post") {
        setJobForm((prev) => ({
          ...prev,
          requirements: [...prev.requirements, newRequirement.trim()],
        }));
      } else {
        setEditJobForm((prev) => ({
          ...prev,
          requirements: [...prev.requirements, newRequirement.trim()],
        }));
      }
      setNewRequirement("");
    }
  };

  const deleteRequirement = (index, formType) => {
    if (formType === "post") {
      setJobForm((prev) => ({
        ...prev,
        requirements: prev.requirements.filter((_, i) => i !== index),
      }));
    } else {
      setEditJobForm((prev) => ({
        ...prev,
        requirements: prev.requirements.filter((_, i) => i !== index),
      }));
    }
  };

  const addResponsibility = (formType) => {
    if (newResponsibility.trim()) {
      if (formType === "post") {
        setJobForm((prev) => ({
          ...prev,
          responsibilities: [
            ...prev.responsibilities,
            newResponsibility.trim(),
          ],
        }));
      } else {
        setEditJobForm((prev) => ({
          ...prev,
          responsibilities: [
            ...prev.responsibilities,
            newResponsibility.trim(),
          ],
        }));
      }
      setNewResponsibility("");
    }
  };

  const deleteResponsibility = (index, formType) => {
    if (formType === "post") {
      setJobForm((prev) => ({
        ...prev,
        responsibilities: prev.responsibilities.filter((_, i) => i !== index),
      }));
    } else {
      setEditJobForm((prev) => ({
        ...prev,
        responsibilities: prev.responsibilities.filter((_, i) => i !== index),
      }));
    }
  };

  // Dropzones
  const logoDropzone = useDropzone({
    accept: { "image/*": [".jpeg", ".png", ".gif"] },
    onDrop: (files) => setLogoFile(files[0]),
  });
  const postImageDropzone = useDropzone({
    accept: { "image/*": [".jpeg", ".png", ".gif"] },
    onDrop: (files) =>
      setJobForm((prev) => ({ ...prev, post_image: files[0] })),
  });
  const editPostImageDropzone = useDropzone({
    accept: { "image/*": [".jpeg", ".png", ".gif"] },
    onDrop: (files) =>
      setEditJobForm((prev) => ({ ...prev, post_image: files[0] })),
  });

  // Chart Data
  const chartData =
    analytics?.jobStats?.map((stat) => ({
      date: new Date(stat.date).toLocaleDateString(),
      jobs: stat.job_count,
      applications:
        analytics.applicationStats?.find((app) => app.date === stat.date)
          ?.application_count || 0,
    })) || [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 fixed h-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Employer Dashboard
        </h2>
        <nav>
          <ul className="space-y-2">
            {[
              { id: "overview", label: "Overview", icon: <FaHome /> },
              { id: "profile", label: "Profile", icon: <FaUser /> },
              { id: "postJob", label: "Post Job", icon: <FaBriefcase /> },
              { id: "jobs", label: "My Jobs", icon: <FaList /> },
              { id: "applied", label: "Applied Jobs", icon: <FaList /> },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center w-full p-2 rounded-lg ${
                    activeSection === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 ml-64">
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <ToastContainer />

        {/* Overview */}
        {activeSection === "overview" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Overview
            </h2>
            <div className="grid gap-6 md:grid-cols-3 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-600">
                  Total Jobs
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics?.totalJobs || 0}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-600">
                  Total Applications
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {analytics?.totalApplications || 0}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-600">
                  Profile Status
                </h3>
                <p className="text-2xl font-bold text-gray-600">
                  {profile ? "Complete" : "Incomplete"}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Activity Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="jobs"
                    stroke="#8884d8"
                    name="Jobs Posted"
                  />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#82ca9d"
                    name="Applications"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Profile */}
        {activeSection === "profile" && (
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Profile
            </h2>
            {!editingProfile && profile ? (
              <div>
                <p>
                  <strong>Company Name:</strong> {profile.company_name}
                </p>
                <p>
                  <strong>Contact Phone:</strong> {profile.contact_phone}
                </p>
                <p>
                  <strong>Description:</strong> {profile.company_description}
                </p>
                {profile.logo_url && (
                  <img
                    src={profile.logo_url}
                    alt="Company Logo"
                    className="mt-2 max-w-xs"
                  />
                )}
                <button
                  onClick={() => setEditingProfile(true)}
                  className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FaEdit className="inline mr-2" /> Edit Profile
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="grid gap-4"
              >
                <input
                  {...registerProfile("company_name", {
                    required: "Company name is required",
                  })}
                  placeholder="Company Name"
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  {...registerProfile("contact_phone", {
                    required: "Phone is required",
                  })}
                  placeholder="Contact Phone"
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  {...registerProfile("company_description")}
                  placeholder="Company Description"
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <div>
                  <label className="block mb-2 text-gray-600">Logo</label>
                  <div
                    {...logoDropzone.getRootProps()}
                    className="p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:border-blue-500"
                  >
                    <input {...logoDropzone.getInputProps()} />
                    {logoFile ? logoFile.name : "Drag or click to upload logo"}
                  </div>
                </div>
                <button
                  type="submit"
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={loading}
                >
                  {profile ? "Update Profile" : "Create Profile"}
                </button>
                {profile && (
                  <button
                    type="button"
                    onClick={() => setEditingProfile(false)}
                    className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 mt-2"
                  >
                    Cancel
                  </button>
                )}
              </form>
            )}
          </section>
        )}

        {/* Post Job */}
        {activeSection === "postJob" && (
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Post a Job
            </h2>
            <form
              onSubmit={handleJobSubmit(onJobSubmit)}
              className="grid gap-4"
            >
              <input
                {...registerJob("title", { required: "Title is required" })}
                placeholder="Job Title"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                {...registerJob("description", {
                  required: "Description is required",
                })}
                placeholder="Description"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <select
                {...registerJob("employment_type")}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="apprenticeship">Apprenticeship</option>
              </select>
              <input
                {...registerJob("salary_min")}
                type="number"
                placeholder="Minimum Salary"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                {...registerJob("salary_max")}
                type="number"
                placeholder="Maximum Salary"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                {...registerJob("location")}
                placeholder="Location (e.g., City, State)"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                {...registerJob("address")}
                placeholder="Address"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                {...registerJob("category")}
                placeholder="Category (e.g., IT, Sales)"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                {...registerJob("application_deadline")}
                type="date"
                placeholder="Application Deadline"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <label className="block mb-2 text-gray-600">Requirements</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Add a requirement"
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => addRequirement("post")}
                    className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <FaPlus />
                  </button>
                </div>
                <ul className="space-y-2">
                  {jobForm.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
                    >
                      <span>{req}</span>
                      <button
                        type="button"
                        onClick={() => deleteRequirement(index, "post")}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <label className="block mb-2 text-gray-600">
                  Responsibilities
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    placeholder="Add a responsibility"
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => addResponsibility("post")}
                    className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <FaPlus />
                  </button>
                </div>
                <ul className="space-y-2">
                  {jobForm.responsibilities.map((resp, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
                    >
                      <span>{resp}</span>
                      <button
                        type="button"
                        onClick={() => deleteResponsibility(index, "post")}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <label className="block mb-2 text-gray-600">Post Image</label>
                <div
                  {...postImageDropzone.getRootProps()}
                  className="p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:border-blue-500"
                >
                  <input {...postImageDropzone.getInputProps()} />
                  {jobForm.post_image
                    ? jobForm.post_image.name
                    : "Drag or click to upload"}
                </div>
              </div>
              <button
                type="submit"
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={loading}
              >
                Post Job
              </button>
            </form>
          </section>
        )}

        {/* My Jobs */}
        {activeSection === "jobs" && (
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              My Jobs
            </h2>
            <ul className="space-y-4">
              {jobs.map((job) => (
                <li key={job.id} className="p-4 bg-gray-50 rounded-lg">
                  {editingJobId !== job.id ? (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-medium text-gray-800">
                          {job.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          Posted: {new Date(job.posted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditJob(job)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        Edit Job
                      </h3>
                      <form
                        onSubmit={handleEditJobSubmit((data) =>
                          onEditJobSubmit(data, job.id)
                        )}
                        className="grid gap-4"
                      >
                        <input
                          {...registerEditJob("title", {
                            required: "Title is required",
                          })}
                          placeholder="Job Title"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          {...registerEditJob("description", {
                            required: "Description is required",
                          })}
                          placeholder="Description"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                        />
                        <select
                          {...registerEditJob("employment_type")}
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="full_time">Full Time</option>
                          <option value="part_time">Part Time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                          <option value="apprenticeship">Apprenticeship</option>
                        </select>
                        <input
                          {...registerEditJob("salary_min")}
                          type="number"
                          placeholder="Minimum Salary"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          {...registerEditJob("salary_max")}
                          type="number"
                          placeholder="Maximum Salary"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          {...registerEditJob("location")}
                          placeholder="Location (e.g., City, State)"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          {...registerEditJob("address")}
                          placeholder="Address"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          {...registerEditJob("category")}
                          placeholder="Category (e.g., IT, Sales)"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          {...registerEditJob("application_deadline")}
                          type="date"
                          placeholder="Application Deadline"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div>
                          <label className="block mb-2 text-gray-600">
                            Requirements
                          </label>
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={newRequirement}
                              onChange={(e) =>
                                setNewRequirement(e.target.value)
                              }
                              placeholder="Add a requirement"
                              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => addRequirement("edit")}
                              className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              <FaPlus />
                            </button>
                          </div>
                          <ul className="space-y-2">
                            {editJobForm.requirements.map((req, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between bg-gray-200 p-2 rounded-lg"
                              >
                                <span>{req}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteRequirement(index, "edit")
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FaTrash />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <label className="block mb-2 text-gray-600">
                            Responsibilities
                          </label>
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={newResponsibility}
                              onChange={(e) =>
                                setNewResponsibility(e.target.value)
                              }
                              placeholder="Add a responsibility"
                              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => addResponsibility("edit")}
                              className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              <FaPlus />
                            </button>
                          </div>
                          <ul className="space-y-2">
                            {editJobForm.responsibilities.map((resp, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between bg-gray-200 p-2 rounded-lg"
                              >
                                <span>{resp}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteResponsibility(index, "edit")
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FaTrash />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <label className="block mb-2 text-gray-600">
                            Post Image
                          </label>
                          <div
                            {...editPostImageDropzone.getRootProps()}
                            className="p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:border-blue-500"
                          >
                            <input {...editPostImageDropzone.getInputProps()} />
                            {editJobForm.post_image
                              ? editJobForm.post_image.name
                              : "Drag or click to upload"}
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            disabled={loading}
                          >
                            Update Job
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingJobId(null)}
                            className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Applied Jobs */}
        {activeSection === "applied" && (
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Applied Jobs
            </h2>
            <ul className="space-y-4">
              {appliedJobs.map((job) => (
                <li key={job.id} className="p-4 bg-gray-50 rounded-lg">
                  {editingAppliedJobId !== job.id ? (
                    <>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-medium text-gray-800">
                            {job.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            Applications: {job.application_count} | Status:{" "}
                            {job.is_active ? "Active" : "Inactive"}
                          </p>
                        </div>
                        <button
                          onClick={() => handleEditJob(job, true)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                      </div>
                      {job.applications && job.applications.length > 0 && (
                        <div className="mt-2">
                          <h3 className="text-sm font-semibold text-gray-700">
                            Applicants:
                          </h3>
                          <ul className="space-y-2">
                            {job.applications.map((app) => (
                              <li
                                key={app.id}
                                className="flex items-center justify-between"
                              >
                                <span>Applicant ID: {app.user_id}</span>
                                <select
                                  value={app.status}
                                  onChange={(e) =>
                                    handleStatusChange(app.id, e.target.value)
                                  }
                                  className="p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="reviewed">Reviewed</option>
                                  <option value="interviewed">
                                    Interviewed
                                  </option>
                                  <option value="offered">Offered</option>
                                  <option value="rejected">Rejected</option>
                                  <option value="withdrawn">Withdrawn</option>
                                </select>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        Edit Job
                      </h3>
                      <form
                        onSubmit={handleEditJobSubmit((data) =>
                          onEditJobSubmit(data, job.id, true)
                        )}
                        className="grid gap-4"
                      >
                        <input
                          {...registerEditJob("title", {
                            required: "Title is required",
                          })}
                          placeholder="Job Title"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          {...registerEditJob("description", {
                            required: "Description is required",
                          })}
                          placeholder="Description"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                        />
                        <select
                          {...registerEditJob("employment_type")}
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="full_time">Full Time</option>
                          <option value="part_time">Part Time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                          <option value="apprenticeship">Apprenticeship</option>
                        </select>
                        <input
                          {...registerEditJob("salary_min")}
                          type="number"
                          placeholder="Minimum Salary"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          {...registerEditJob("salary_max")}
                          type="number"
                          placeholder="Maximum Salary"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          {...registerEditJob("location")}
                          placeholder="Location (e.g., City, State)"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          {...registerEditJob("address")}
                          placeholder="Address"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          {...registerEditJob("category")}
                          placeholder="Category (e.g., IT, Sales)"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          {...registerEditJob("application_deadline")}
                          type="date"
                          placeholder="Application Deadline"
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div>
                          <label className="block mb-2 text-gray-600">
                            Requirements
                          </label>
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={newRequirement}
                              onChange={(e) =>
                                setNewRequirement(e.target.value)
                              }
                              placeholder="Add a requirement"
                              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => addRequirement("edit")}
                              className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              <FaPlus />
                            </button>
                          </div>
                          <ul className="space-y-2">
                            {editJobForm.requirements.map((req, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between bg-gray-200 p-2 rounded-lg"
                              >
                                <span>{req}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteRequirement(index, "edit")
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FaTrash />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <label className="block mb-2 text-gray-600">
                            Responsibilities
                          </label>
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={newResponsibility}
                              onChange={(e) =>
                                setNewResponsibility(e.target.value)
                              }
                              placeholder="Add a responsibility"
                              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => addResponsibility("edit")}
                              className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              <FaPlus />
                            </button>
                          </div>
                          <ul className="space-y-2">
                            {editJobForm.responsibilities.map((resp, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between bg-gray-200 p-2 rounded-lg"
                              >
                                <span>{resp}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteResponsibility(index, "edit")
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FaTrash />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <label className="block mb-2 text-gray-600">
                            Post Image
                          </label>
                          <div
                            {...editPostImageDropzone.getRootProps()}
                            className="p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:border-blue-500"
                          >
                            <input {...editPostImageDropzone.getInputProps()} />
                            {editJobForm.post_image
                              ? editJobForm.post_image.name
                              : "Drag or click to upload"}
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            disabled={loading}
                          >
                            Update Job
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingAppliedJobId(null)}
                            className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

export default EmployerDashboard;
