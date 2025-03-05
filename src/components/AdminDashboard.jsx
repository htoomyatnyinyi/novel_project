import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchJobs,
  updateJob,
  deleteJob,
  fetchAnalytics,
  fetchCategories,
} from "../redux/slice/adminSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    users,
    jobs,
    analytics,
    categories,
    userPagination,
    jobPagination,
    loading,
    error,
  } = useSelector((state) => state.admin);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "job_seeker",
  });
  const [editUser, setEditUser] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [userFilter, setUserFilter] = useState({ role: "" });
  const [jobFilter, setJobFilter] = useState({ is_active: "", category: "" });
  const [userPage, setUserPage] = useState(1);
  const [jobPage, setJobPage] = useState(1);
  const [maxButtons, setMaxButtons] = useState(5);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers({ page: userPage, limit: 10, role: userFilter.role }));
    dispatch(
      fetchJobs({
        page: jobPage,
        limit: 10,
        is_active: jobFilter.is_active,
        category: jobFilter.category,
      })
    );
    dispatch(fetchAnalytics());
    dispatch(fetchCategories());
  }, [dispatch, userPage, jobPage, userFilter, jobFilter]);

  const handleCreateUser = (e) => {
    e.preventDefault();
    dispatch(createUser(newUser)).then(() => {
      setNewUser({ username: "", email: "", password: "", role: "job_seeker" });
      dispatch(
        fetchUsers({ page: userPage, limit: 10, role: userFilter.role })
      );
    });
  };

  const openEditUserModal = (user) => setEditUser({ ...user });
  const handleEditUser = (e) => {
    e.preventDefault();
    dispatch(updateUser({ id: editUser.id, data: editUser })).then(() => {
      setEditUser(null);
      dispatch(
        fetchUsers({ page: userPage, limit: 10, role: userFilter.role })
      );
    });
  };

  const openEditJobModal = (job) => {
    const formattedDeadline = job.application_deadline
      ? new Date(job.application_deadline).toISOString().split("T")[0]
      : "";
    setEditJob({
      ...job,
      application_deadline: formattedDeadline,
      requirements: job.requirements || [],
      responsibilities: job.responsibilities || [],
    });
  };
  const handleEditJob = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(editJob).forEach(([key, value]) => {
      if (key === "requirements" || key === "responsibilities") {
        value.forEach((item, index) =>
          formData.append(`${key}[${index}]`, item)
        );
      } else if (key !== "company_logo" && key !== "post_image") {
        formData.append(key, value);
      }
    });
    if (editJob.company_logo)
      formData.append("company_logo", editJob.company_logo);
    if (editJob.post_image) formData.append("post_image", editJob.post_image);

    dispatch(updateJob({ id: editJob.id, data: formData })).then(() => {
      setEditJob(null);
      setCompanyLogoPreview(null);
      setPostImagePreview(null);
      dispatch(
        fetchJobs({
          page: jobPage,
          limit: 10,
          is_active: jobFilter.is_active,
          category: jobFilter.category,
        })
      );
    });
  };

  const addRequirement = (req) => {
    if (req.trim())
      setEditJob({ ...editJob, requirements: [...editJob.requirements, req] });
  };

  const addResponsibility = (resp) => {
    if (resp.trim())
      setEditJob({
        ...editJob,
        responsibilities: [...editJob.responsibilities, resp],
      });
  };

  const deleteUserHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this user?"))
      dispatch(deleteUser(id));
  };

  const deleteJobHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this job?"))
      dispatch(deleteJob(id));
  };

  const renderPagination = (currentPage, totalPages, setPage) => {
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          disabled={loading}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || loading}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
        >
          Next
        </button>
        <select
          value={maxButtons}
          onChange={(e) => setMaxButtons(Number(e.target.value))}
          className="ml-4 p-2 border rounded"
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={7}>7</option>
        </select>
      </div>
    );
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setEditJob({ ...editJob, [type]: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "company_logo") setCompanyLogoPreview(reader.result);
        else if (type === "post_image") setPostImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Analytics */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Total Users</h3>
          <p className="text-2xl">{analytics.total_users}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Total Jobs</h3>
          <p className="text-2xl">{analytics.total_jobs}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Total Applications</h3>
          <p className="text-2xl">{analytics.total_applications}</p>
        </div>
      </div>

      {/* Create User */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Create New User</h3>
        <form
          onSubmit={handleCreateUser}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            placeholder="Username"
            className="p-2 border rounded"
            required
          />
          <input
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Email"
            type="email"
            className="p-2 border rounded"
            required
          />
          <input
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            placeholder="Password"
            type="password"
            className="p-2 border rounded"
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="job_seeker">Job Seeker</option>
            <option value="employer">Employer</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="md:col-span-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            Create User
          </button>
        </form>
      </div>

      {/* Users Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Users</h3>
        <div className="mb-4 flex space-x-4">
          <div>
            <label className="mr-2">Filter by Role:</label>
            <select
              value={userFilter.role}
              onChange={(e) => {
                setUserFilter({ ...userFilter, role: e.target.value });
                setUserPage(1);
              }}
              className="p-2 border rounded"
            >
              <option value="">All</option>
              <option value="job_seeker">Job Seeker</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{user.username}</p>
                <p>
                  {user.email} ({user.role})
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => openEditUserModal(user)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteUserHandler(user.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        {userPagination &&
          renderPagination(userPage, userPagination.totalPages, setUserPage)}
      </div>

      {/* Jobs Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Job Posts</h3>
        <div className="mb-4 flex space-x-4">
          <div>
            <label className="mr-2">Filter by Status:</label>
            <select
              value={jobFilter.is_active}
              onChange={(e) => {
                setJobFilter({ ...jobFilter, is_active: e.target.value });
                setJobPage(1);
              }}
              className="p-2 border rounded"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div>
            <label className="mr-2">Filter by Category:</label>
            <select
              value={jobFilter.category}
              onChange={(e) => {
                setJobFilter({ ...jobFilter, category: e.target.value });
                setJobPage(1);
              }}
              className="p-2 border rounded"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{job.title}</p>
                <p>{job.company_name}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => openEditJobModal(job)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteJobHandler(job.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        {jobPagination &&
          renderPagination(jobPage, jobPagination.totalPages, setJobPage)}
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit User</h3>
            <form onSubmit={handleEditUser} className="space-y-4">
              <input
                value={editUser.username}
                onChange={(e) =>
                  setEditUser({ ...editUser, username: e.target.value })
                }
                placeholder="Username"
                className="w-full p-2 border rounded"
              />
              <input
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                placeholder="Email"
                type="email"
                className="w-full p-2 border rounded"
              />
              <input
                value={editUser.password || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, password: e.target.value })
                }
                placeholder="New Password (optional)"
                type="password"
                className="w-full p-2 border rounded"
              />
              <select
                value={editUser.role}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                <option value="job_seeker">Job Seeker</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
              </select>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editUser.is_active}
                  onChange={(e) =>
                    setEditUser({ ...editUser, is_active: e.target.checked })
                  }
                  className="mr-2"
                />
                Active
              </label>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editJob && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Job</h3>
            <form onSubmit={handleEditJob} className="space-y-4">
              <input
                value={editJob.title}
                onChange={(e) =>
                  setEditJob({ ...editJob, title: e.target.value })
                }
                placeholder="Title"
                className="w-full p-2 border rounded"
              />
              <textarea
                value={editJob.description}
                onChange={(e) =>
                  setEditJob({ ...editJob, description: e.target.value })
                }
                placeholder="Description"
                className="w-full p-2 border rounded"
                rows="3"
              />
              <input
                value={editJob.salary_min || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, salary_min: e.target.value })
                }
                placeholder="Min Salary"
                type="number"
                className="w-full p-2 border rounded"
              />
              <input
                value={editJob.salary_max || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, salary_max: e.target.value })
                }
                placeholder="Max Salary"
                type="number"
                className="w-full p-2 border rounded"
              />
              <input
                value={editJob.location || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, location: e.target.value })
                }
                placeholder="Location"
                className="w-full p-2 border rounded"
              />
              <input
                value={editJob.address || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, address: e.target.value })
                }
                placeholder="Address"
                className="w-full p-2 border rounded"
              />
              <input
                value={editJob.category || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, category: e.target.value })
                }
                placeholder="Category"
                className="w-full p-2 border rounded"
              />
              <input
                value={editJob.application_deadline || ""}
                onChange={(e) =>
                  setEditJob({
                    ...editJob,
                    application_deadline: e.target.value,
                  })
                }
                placeholder="Deadline (YYYY-MM-DD)"
                type="date"
                className="w-full p-2 border rounded"
              />
              <select
                value={editJob.employment_type}
                onChange={(e) =>
                  setEditJob({ ...editJob, employment_type: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="apprenticeship">Apprenticeship</option>
              </select>
              <div>
                <label className="block mb-1">Company Logo</label>
                <input
                  type="file"
                  onChange={(e) => handleImageChange(e, "company_logo")}
                  accept="image/*"
                  className="w-full p-2"
                />
                {(companyLogoPreview || editJob.company_logo_url) && (
                  <img
                    src={
                      companyLogoPreview ||
                      `http://localhost:8080${editJob.company_logo_url}`
                    }
                    alt="Company Logo Preview"
                    className="mt-2 w-32 h-32 object-cover rounded"
                  />
                )}
              </div>
              <div>
                <label className="block mb-1">Post Image</label>
                <input
                  type="file"
                  onChange={(e) => handleImageChange(e, "post_image")}
                  accept="image/*"
                  className="w-full p-2"
                />
                {(postImagePreview || editJob.post_image_url) && (
                  <img
                    src={
                      postImagePreview ||
                      `http://localhost:8080${editJob.post_image_url}`
                    }
                    alt="Post Image Preview"
                    className="mt-2 w-32 h-32 object-cover rounded"
                  />
                )}
              </div>
              <div>
                <label className="block mb-1">Requirements</label>
                <div className="flex mb-2">
                  <input
                    id="newRequirement"
                    placeholder="Add requirement"
                    className="w-full p-2 border rounded"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addRequirement(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const req =
                        document.getElementById("newRequirement").value;
                      addRequirement(req);
                      document.getElementById("newRequirement").value = "";
                    }}
                    className="ml-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>
                <ul className="space-y-1">
                  {editJob.requirements.map((req, index) => (
                    <li key={index} className="flex justify-between">
                      {req}
                      <button
                        onClick={() =>
                          setEditJob({
                            ...editJob,
                            requirements: editJob.requirements.filter(
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
              <div>
                <label className="block mb-1">Responsibilities</label>
                <div className="flex mb-2">
                  <input
                    id="newResponsibility"
                    placeholder="Add responsibility"
                    className="w-full p-2 border rounded"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addResponsibility(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const resp =
                        document.getElementById("newResponsibility").value;
                      addResponsibility(resp);
                      document.getElementById("newResponsibility").value = "";
                    }}
                    className="ml-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>
                <ul className="space-y-1">
                  {editJob.responsibilities.map((resp, index) => (
                    <li key={index} className="flex justify-between">
                      {resp}
                      <button
                        onClick={() =>
                          setEditJob({
                            ...editJob,
                            responsibilities: editJob.responsibilities.filter(
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
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editJob.is_active}
                  onChange={(e) =>
                    setEditJob({ ...editJob, is_active: e.target.checked })
                  }
                  className="mr-2"
                />
                Active
              </label>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditJob(null);
                    setCompanyLogoPreview(null);
                    setPostImagePreview(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; // import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchUsers,
//   createUser,
//   updateUser,
//   deleteUser,
//   fetchJobs,
//   updateJob,
//   deleteJob,
//   fetchAnalytics,
//   fetchCategories,
// } from "../redux/slice/adminSlice";

// const AdminDashboard = () => {
//   const dispatch = useDispatch();
//   const {
//     users,
//     jobs,
//     analytics,
//     categories,
//     userPagination,
//     jobPagination,
//     loading,
//     error,
//   } = useSelector((state) => state.admin);

//   const [newUser, setNewUser] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "job_seeker",
//   });
//   const [editUser, setEditUser] = useState(null);
//   const [editJob, setEditJob] = useState(null);
//   const [userFilter, setUserFilter] = useState({ role: "" });
//   const [jobFilter, setJobFilter] = useState({
//     is_active: "true",
//     category: "",
//   });
//   const [userPage, setUserPage] = useState(1);
//   const [jobPage, setJobPage] = useState(1);
//   const [maxButtons, setMaxButtons] = useState(5); // Adjustable pagination range
//   const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
//   const [postImagePreview, setPostImagePreview] = useState(null);

//   useEffect(() => {
//     dispatch(fetchUsers({ page: userPage, limit: 10, role: userFilter.role }));
//     dispatch(
//       fetchJobs({
//         page: jobPage,
//         limit: 10,
//         is_active: jobFilter.is_active,
//         category: jobFilter.category,
//       })
//     );
//     dispatch(fetchAnalytics());
//     dispatch(fetchCategories());
//   }, [dispatch, userPage, jobPage, userFilter, jobFilter]);

//   const handleCreateUser = (e) => {
//     e.preventDefault();
//     dispatch(createUser(newUser)).then(() => {
//       setNewUser({ username: "", email: "", password: "", role: "job_seeker" });
//       dispatch(
//         fetchUsers({ page: userPage, limit: 10, role: userFilter.role })
//       );
//     });
//   };

//   const openEditUserModal = (user) => setEditUser({ ...user });
//   const handleEditUser = (e) => {
//     e.preventDefault();
//     dispatch(updateUser({ id: editUser.id, data: editUser })).then(() => {
//       setEditUser(null);
//       dispatch(
//         fetchUsers({ page: userPage, limit: 10, role: userFilter.role })
//       );
//     });
//   };

//   const openEditJobModal = (job) =>
//     setEditJob({
//       ...job,
//       requirements: job.requirements || [],
//       responsibilities: job.responsibilities || [],
//     });

//   const handleEditJob = (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.entries(editJob).forEach(([key, value]) => {
//       if (key === "requirements" || key === "responsibilities") {
//         value.forEach((item, index) =>
//           formData.append(`${key}[${index}]`, item)
//         );
//       } else if (key !== "company_logo" && key !== "post_image") {
//         formData.append(key, value);
//       }
//     });
//     if (editJob.company_logo)
//       formData.append("company_logo", editJob.company_logo);
//     if (editJob.post_image) formData.append("post_image", editJob.post_image);

//     dispatch(updateJob({ id: editJob.id, data: formData })).then(() => {
//       setEditJob(null);
//       setCompanyLogoPreview(null);
//       setPostImagePreview(null);
//       dispatch(
//         fetchJobs({
//           page: jobPage,
//           limit: 10,
//           is_active: jobFilter.is_active,
//           category: jobFilter.category,
//         })
//       );
//     });
//   };

//   const addRequirement = (req) => {
//     if (req.trim())
//       setEditJob({ ...editJob, requirements: [...editJob.requirements, req] });
//   };

//   const addResponsibility = (resp) => {
//     if (resp.trim())
//       setEditJob({
//         ...editJob,
//         responsibilities: [...editJob.responsibilities, resp],
//       });
//   };

//   const deleteUserHandler = (id) => {
//     if (window.confirm("Are you sure you want to delete this user?"))
//       dispatch(deleteUser(id));
//   };

//   const deleteJobHandler = (id) => {
//     if (window.confirm("Are you sure you want to delete this job?"))
//       dispatch(deleteJob(id));
//   };

//   const renderPagination = (currentPage, totalPages, setPage) => {
//     const half = Math.floor(maxButtons / 2);
//     let start = Math.max(1, currentPage - half);
//     let end = Math.min(totalPages, start + maxButtons - 1);
//     if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);

//     const pages = [];
//     for (let i = start; i <= end; i++) {
//       pages.push(
//         <button
//           key={i}
//           onClick={() => setPage(i)}
//           className={`px-3 py-1 rounded ${
//             currentPage === i
//               ? "bg-blue-500 text-white"
//               : "bg-gray-300 hover:bg-gray-400"
//           }`}
//           disabled={loading}
//         >
//           {i}
//         </button>
//       );
//     }
//     // comment do not knwo
//     const openEditJobModal = (job) => {
//       const formattedDeadline = job.application_deadline
//         ? new Date(job.application_deadline).toISOString().split("T")[0]
//         : "";
//       setEditJob({
//         ...job,
//         application_deadline: formattedDeadline,
//         requirements: job.requirements || [],
//         responsibilities: job.responsibilities || [],
//       });
//     };
//     return (
//       <div className="mt-4 flex justify-center space-x-2">
//         <button
//           onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1 || loading}
//           className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
//         >
//           Previous
//         </button>
//         {pages}
//         <button
//           onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages || loading}
//           className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
//         >
//           Next
//         </button>
//         <select
//           value={maxButtons}
//           onChange={(e) => setMaxButtons(Number(e.target.value))}
//           className="ml-4 p-2 border rounded"
//         >
//           <option value={3}>3</option>
//           <option value={5}>5</option>
//           <option value={7}>7</option>
//         </select>
//       </div>
//     );
//   };

//   const handleImageChange = (e, type) => {
//     const file = e.target.files[0];
//     if (file) {
//       setEditJob({ ...editJob, [type]: file });
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (type === "company_logo") setCompanyLogoPreview(reader.result);
//         else if (type === "post_image") setPostImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
//       {loading && <p className="text-gray-500">Loading...</p>}
//       {error && (
//         <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
//           <p>{error}</p>
//         </div>
//       )}

//       {/* Analytics */}
//       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-xl font-semibold">Total Users</h3>
//           <p className="text-2xl">{analytics.total_users}</p>
//         </div>
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-xl font-semibold">Total Jobs</h3>
//           <p className="text-2xl">{analytics.total_jobs}</p>
//         </div>
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-xl font-semibold">Total Applications</h3>
//           <p className="text-2xl">{analytics.total_applications}</p>
//         </div>
//       </div>

//       {/* Create User */}
//       <div className="mb-8">
//         <h3 className="text-xl font-semibold mb-4">Create New User</h3>
//         <form
//           onSubmit={handleCreateUser}
//           className="grid grid-cols-1 md:grid-cols-4 gap-4"
//         >
//           <input
//             value={newUser.username}
//             onChange={(e) =>
//               setNewUser({ ...newUser, username: e.target.value })
//             }
//             placeholder="Username"
//             className="p-2 border rounded"
//             required
//           />
//           <input
//             value={newUser.email}
//             onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
//             placeholder="Email"
//             type="email"
//             className="p-2 border rounded"
//             required
//           />
//           <input
//             value={newUser.password}
//             onChange={(e) =>
//               setNewUser({ ...newUser, password: e.target.value })
//             }
//             placeholder="Password"
//             type="password"
//             className="p-2 border rounded"
//             required
//           />
//           <select
//             value={newUser.role}
//             onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
//             className="p-2 border rounded"
//           >
//             <option value="job_seeker">Job Seeker</option>
//             <option value="employer">Employer</option>
//             <option value="admin">Admin</option>
//           </select>
//           <button
//             type="submit"
//             className="md:col-span-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             disabled={loading}
//           >
//             Create User
//           </button>
//         </form>
//       </div>

//       {/* Users Section */}
//       <div className="mb-8">
//         <h3 className="text-xl font-semibold mb-4">Users</h3>
//         <div className="mb-4 flex space-x-4">
//           <div>
//             <label className="mr-2">Filter by Role:</label>
//             <select
//               value={userFilter.role}
//               onChange={(e) => {
//                 setUserFilter({ ...userFilter, role: e.target.value });
//                 setUserPage(1);
//               }}
//               className="p-2 border rounded"
//             >
//               <option value="">All</option>
//               <option value="job_seeker">Job Seeker</option>
//               <option value="employer">Employer</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>
//         </div>
//         <ul className="space-y-4">
//           {users.map((user) => (
//             <li
//               key={user.id}
//               className="bg-white p-4 rounded shadow flex justify-between items-center"
//             >
//               <div>
//                 <p className="font-semibold">{user.username}</p>
//                 <p>
//                   {user.email} ({user.role})
//                 </p>
//               </div>
//               <div className="space-x-2">
//                 <button
//                   onClick={() => openEditUserModal(user)}
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => deleteUserHandler(user.id)}
//                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//         {userPagination &&
//           renderPagination(userPage, userPagination.totalPages, setUserPage)}
//       </div>

//       {/* Jobs Section */}
//       <div>
//         <h3 className="text-xl font-semibold mb-4">Job Posts</h3>
//         <div className="mb-4 flex space-x-4">
//           <div>
//             <label className="mr-2">Filter by Status:</label>
//             <select
//               value={jobFilter.is_active}
//               onChange={(e) => {
//                 setJobFilter({ ...jobFilter, is_active: e.target.value });
//                 setJobPage(1);
//               }}
//               className="p-2 border rounded"
//             >
//               {/* <option value="true">All</option> */}
//               <option value="true">Active</option>
//               <option value="false">Inactive</option>
//             </select>
//           </div>
//           <div>
//             <label className="mr-2">Filter by Category:</label>
//             <select
//               value={jobFilter.category}
//               onChange={(e) => {
//                 setJobFilter({ ...jobFilter, category: e.target.value });
//                 setJobPage(1);
//               }}
//               className="p-2 border rounded"
//             >
//               <option value="">All</option>
//               {categories.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//         <ul className="space-y-4">
//           {jobs.map((job) => (
//             <li
//               key={job.id}
//               className="bg-white p-4 rounded shadow flex justify-between items-center"
//             >
//               <div>
//                 <p className="font-semibold">{job.title}</p>
//                 <p>{job.company_name}</p>
//               </div>
//               <div className="space-x-2">
//                 <button
//                   onClick={() => openEditJobModal(job)}
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => deleteJobHandler(job.id)}
//                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//         {jobPagination &&
//           renderPagination(jobPage, jobPagination.totalPages, setJobPage)}
//       </div>

//       {/* Edit User Modal */}
//       {editUser && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
//             <h3 className="text-xl font-semibold mb-4">Edit User</h3>
//             <form onSubmit={handleEditUser} className="space-y-4">
//               <input
//                 value={editUser.username}
//                 onChange={(e) =>
//                   setEditUser({ ...editUser, username: e.target.value })
//                 }
//                 placeholder="Username"
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 value={editUser.email}
//                 onChange={(e) =>
//                   setEditUser({ ...editUser, email: e.target.value })
//                 }
//                 placeholder="Email"
//                 type="email"
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 value={editUser.password || ""}
//                 onChange={(e) =>
//                   setEditUser({ ...editUser, password: e.target.value })
//                 }
//                 placeholder="New Password (optional)"
//                 type="password"
//                 className="w-full p-2 border rounded"
//               />
//               <select
//                 value={editUser.role}
//                 onChange={(e) =>
//                   setEditUser({ ...editUser, role: e.target.value })
//                 }
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="job_seeker">Job Seeker</option>
//                 <option value="employer">Employer</option>
//                 <option value="admin">Admin</option>
//               </select>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={editUser.is_active}
//                   onChange={(e) =>
//                     setEditUser({ ...editUser, is_active: e.target.checked })
//                   }
//                   className="mr-2"
//                 />
//                 Active
//               </label>
//               <div className="flex space-x-2">
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                   disabled={loading}
//                 >
//                   Save
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setEditUser(null)}
//                   className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Job Modal */}
//       {editJob && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
//             <h3 className="text-xl font-semibold mb-4">Edit Job</h3>
//             <form onSubmit={handleEditJob} className="space-y-4">
//               <input
//                 value={editJob.title}
//                 onChange={(e) =>
//                   setEditJob({ ...editJob, title: e.target.value })
//                 }
//                 placeholder="Title"
//                 className="w-full p-2 border rounded"
//               />
//               <textarea
//                 value={editJob.description}
//                 onChange={(e) =>
//                   setEditJob({ ...editJob, description: e.target.value })
//                 }
//                 placeholder="Description"
//                 className="w-full p-2 border rounded"
//                 rows="3"
//               />
//               <input
//                 value={editJob.salary_min || ""}
//                 onChange={(e) =>
//                   setEditJob({ ...editJob, salary_min: e.target.value })
//                 }
//                 placeholder="Min Salary"
//                 type="number"
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 value={editJob.salary_max || ""}
//                 onChange={(e) =>
//                   setEditJob({ ...editJob, salary_max: e.target.value })
//                 }
//                 placeholder="Max Salary"
//                 type="number"
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 value={editJob.location || ""}
//                 onChange={(e) =>
//                   setEditJob({ ...editJob, location: e.target.value })
//                 }
//                 placeholder="Location"
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 value={editJob.address || ""}
//                 onChange={(e) =>
//                   setEditJob({ ...editJob, address: e.target.value })
//                 }
//                 placeholder="Address"
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 value={editJob.category || ""}
//                 onChange={(e) =>
//                   setEditJob({ ...editJob, category: e.target.value })
//                 }
//                 placeholder="Category"
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 value={editJob.application_deadline || ""}
//                 onChange={(e) =>
//                   setEditJob({
//                     ...editJob,
//                     application_deadline: e.target.value,
//                   })
//                 }
//                 placeholder="Deadline (YYYY-MM-DD)"
//                 type="date"
//                 className="w-full p-2 border rounded"
//               />
//               <select
//                 value={editJob.employment_type}
//                 onChange={(e) =>
//                   setEditJob({ ...editJob, employment_type: e.target.value })
//                 }
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="full_time">Full Time</option>
//                 <option value="part_time">Part Time</option>
//                 <option value="contract">Contract</option>
//                 <option value="internship">Internship</option>
//                 <option value="apprenticeship">Apprenticeship</option>
//               </select>
//               <div>
//                 <label className="block mb-1">Company Logo</label>
//                 <input
//                   type="file"
//                   onChange={(e) => handleImageChange(e, "company_logo")}
//                   accept="image/*"
//                   className="w-full p-2"
//                 />
//                 {(companyLogoPreview || editJob.company_logo_url) && (
//                   <img
//                     src={
//                       companyLogoPreview ||
//                       `http://localhost:8080${editJob.company_logo_url}`
//                     }
//                     alt="Company Logo Preview"
//                     className="mt-2 w-32 h-32 object-cover rounded"
//                   />
//                 )}
//               </div>
//               <div>
//                 <label className="block mb-1">Post Image</label>
//                 <input
//                   type="file"
//                   onChange={(e) => handleImageChange(e, "post_image")}
//                   accept="image/*"
//                   className="w-full p-2"
//                 />
//                 {(postImagePreview || editJob.post_image_url) && (
//                   <img
//                     src={
//                       postImagePreview ||
//                       `http://localhost:8080${editJob.post_image_url}`
//                     }
//                     alt="Post Image Preview"
//                     className="mt-2 w-32 h-32 object-cover rounded"
//                   />
//                 )}
//               </div>
//               <div>
//                 <label className="block mb-1">Requirements</label>
//                 <div className="flex mb-2">
//                   <input
//                     id="newRequirement"
//                     placeholder="Add requirement"
//                     className="w-full p-2 border rounded"
//                     onKeyPress={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         addRequirement(e.target.value);
//                         e.target.value = "";
//                       }
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => {
//                       const req =
//                         document.getElementById("newRequirement").value;
//                       addRequirement(req);
//                       document.getElementById("newRequirement").value = "";
//                     }}
//                     className="ml-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <ul className="space-y-1">
//                   {editJob.requirements.map((req, index) => (
//                     <li key={index} className="flex justify-between">
//                       {req}
//                       <button
//                         onClick={() =>
//                           setEditJob({
//                             ...editJob,
//                             requirements: editJob.requirements.filter(
//                               (_, i) => i !== index
//                             ),
//                           })
//                         }
//                         className="text-red-500"
//                       >
//                         Remove
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div>
//                 <label className="block mb-1">Responsibilities</label>
//                 <div className="flex mb-2">
//                   <input
//                     id="newResponsibility"
//                     placeholder="Add responsibility"
//                     className="w-full p-2 border rounded"
//                     onKeyPress={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         addResponsibility(e.target.value);
//                         e.target.value = "";
//                       }
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => {
//                       const resp =
//                         document.getElementById("newResponsibility").value;
//                       addResponsibility(resp);
//                       document.getElementById("newResponsibility").value = "";
//                     }}
//                     className="ml-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <ul className="space-y-1">
//                   {editJob.responsibilities.map((resp, index) => (
//                     <li key={index} className="flex justify-between">
//                       {resp}
//                       <button
//                         onClick={() =>
//                           setEditJob({
//                             ...editJob,
//                             responsibilities: editJob.responsibilities.filter(
//                               (_, i) => i !== index
//                             ),
//                           })
//                         }
//                         className="text-red-500"
//                       >
//                         Remove
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={editJob.is_active}
//                   onChange={(e) =>
//                     setEditJob({ ...editJob, is_active: e.target.checked })
//                   }
//                   className="mr-2"
//                 />
//                 Active
//               </label>
//               <div className="flex space-x-2">
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                   disabled={loading}
//                 >
//                   Save
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setEditJob(null);
//                     setCompanyLogoPreview(null);
//                     setPostImagePreview(null);
//                   }}
//                   className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;
// // old code
// // import React, { useEffect, useState } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import {
// //   fetchUsers,
// //   createUser,
// //   updateUser,
// //   deleteUser,
// //   fetchJobs,
// //   updateJob,
// //   deleteJob,
// //   fetchAnalytics,
// // } from "../redux/slice/adminSlice";

// // const AdminDashboard = () => {
// //   const dispatch = useDispatch();
// //   const {
// //     users,
// //     jobs,
// //     analytics,
// //     userPagination,
// //     jobPagination,
// //     loading,
// //     error,
// //   } = useSelector((state) => state.admin);

// //   const [newUser, setNewUser] = useState({
// //     username: "",
// //     email: "",
// //     password: "",
// //     role: "job_seeker",
// //   });
// //   const [editUser, setEditUser] = useState(null);
// //   const [editJob, setEditJob] = useState(null);
// //   const [userFilter, setUserFilter] = useState({ role: "" });
// //   const [jobFilter, setJobFilter] = useState({ is_active: "", category: "" });
// //   const [userPage, setUserPage] = useState(1);
// //   const [jobPage, setJobPage] = useState(1);

// //   useEffect(() => {
// //     dispatch(fetchUsers({ page: userPage, limit: 10, role: userFilter.role }));
// //     dispatch(
// //       fetchJobs({
// //         page: jobPage,
// //         limit: 10,
// //         is_active: jobFilter.is_active,
// //         category: jobFilter.category,
// //       })
// //     );
// //     dispatch(fetchAnalytics());
// //   }, [dispatch, userPage, jobPage, userFilter, jobFilter]);

// //   const handleCreateUser = (e) => {
// //     e.preventDefault();
// //     dispatch(createUser(newUser)).then(() => {
// //       setNewUser({ username: "", email: "", password: "", role: "job_seeker" });
// //       dispatch(
// //         fetchUsers({ page: userPage, limit: 10, role: userFilter.role })
// //       );
// //     });
// //   };

// //   const openEditUserModal = (user) => setEditUser({ ...user });
// //   const handleEditUser = (e) => {
// //     e.preventDefault();
// //     dispatch(updateUser({ id: editUser.id, data: editUser })).then(() => {
// //       setEditUser(null);
// //       dispatch(
// //         fetchUsers({ page: userPage, limit: 10, role: userFilter.role })
// //       );
// //     });
// //   };

// //   const openEditJobModal = (job) =>
// //     setEditJob({
// //       ...job,
// //       requirements: job.requirements || [],
// //       responsibilities: job.responsibilities || [],
// //     });
// //   const handleEditJob = (e) => {
// //     e.preventDefault();
// //     dispatch(updateJob({ id: editJob.id, data: editJob })).then(() => {
// //       setEditJob(null);
// //       dispatch(
// //         fetchJobs({
// //           page: jobPage,
// //           limit: 10,
// //           is_active: jobFilter.is_active,
// //           category: jobFilter.category,
// //         })
// //       );
// //     });
// //   };

// //   const addRequirement = (req) => {
// //     if (req.trim())
// //       setEditJob({ ...editJob, requirements: [...editJob.requirements, req] });
// //   };

// //   const addResponsibility = (resp) => {
// //     if (resp.trim())
// //       setEditJob({
// //         ...editJob,
// //         responsibilities: [...editJob.responsibilities, resp],
// //       });
// //   };

// //   const deleteUserHandler = (id) => {
// //     if (window.confirm("Are you sure you want to delete this user?"))
// //       dispatch(deleteUser(id));
// //   };

// //   const deleteJobHandler = (id) => {
// //     if (window.confirm("Are you sure you want to delete this job?"))
// //       dispatch(deleteJob(id));
// //   };

// //   const renderPagination = (currentPage, totalPages, setPage) => {
// //     const pages = [];
// //     for (let i = 1; i <= totalPages; i++) {
// //       pages.push(
// //         <button
// //           key={i}
// //           onClick={() => setPage(i)}
// //           className={`px-3 py-1 rounded ${
// //             currentPage === i
// //               ? "bg-blue-500 text-white"
// //               : "bg-gray-300 hover:bg-gray-400"
// //           }`}
// //           disabled={loading}
// //         >
// //           {i}
// //         </button>
// //       );
// //     }
// //     return (
// //       <div className="mt-4 flex justify-center space-x-2">
// //         <button
// //           onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
// //           disabled={currentPage === 1 || loading}
// //           className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
// //         >
// //           Previous
// //         </button>
// //         {pages}
// //         <button
// //           onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
// //           disabled={currentPage === totalPages || loading}
// //           className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
// //         >
// //           Next
// //         </button>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="p-6">
// //       <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
// //       {loading && <p className="text-gray-500">Loading...</p>}
// //       {error && (
// //         <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
// //           <p>{error}</p>
// //         </div>
// //       )}

// //       {/* Analytics */}
// //       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
// //         <div className="bg-white p-4 rounded shadow">
// //           <h3 className="text-xl font-semibold">Total Users</h3>
// //           <p className="text-2xl">{analytics.total_users}</p>
// //         </div>
// //         <div className="bg-white p-4 rounded shadow">
// //           <h3 className="text-xl font-semibold">Total Jobs</h3>
// //           <p className="text-2xl">{analytics.total_jobs}</p>
// //         </div>
// //         <div className="bg-white p-4 rounded shadow">
// //           <h3 className="text-xl font-semibold">Total Applications</h3>
// //           <p className="text-2xl">{analytics.total_applications}</p>
// //         </div>
// //       </div>

// //       {/* Create User */}
// //       <div className="mb-8">
// //         <h3 className="text-xl font-semibold mb-4">Create New User</h3>
// //         <form
// //           onSubmit={handleCreateUser}
// //           className="grid grid-cols-1 md:grid-cols-4 gap-4"
// //         >
// //           <input
// //             value={newUser.username}
// //             onChange={(e) =>
// //               setNewUser({ ...newUser, username: e.target.value })
// //             }
// //             placeholder="Username"
// //             className="p-2 border rounded"
// //             required
// //           />
// //           <input
// //             value={newUser.email}
// //             onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
// //             placeholder="Email"
// //             type="email"
// //             className="p-2 border rounded"
// //             required
// //           />
// //           <input
// //             value={newUser.password}
// //             onChange={(e) =>
// //               setNewUser({ ...newUser, password: e.target.value })
// //             }
// //             placeholder="Password"
// //             type="password"
// //             className="p-2 border rounded"
// //             required
// //           />
// //           <select
// //             value={newUser.role}
// //             onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
// //             className="p-2 border rounded"
// //           >
// //             <option value="job_seeker">Job Seeker</option>
// //             <option value="employer">Employer</option>
// //             <option value="admin">Admin</option>
// //           </select>
// //           <button
// //             type="submit"
// //             className="md:col-span-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //             disabled={loading}
// //           >
// //             Create User
// //           </button>
// //         </form>
// //       </div>

// //       {/* Users Section */}
// //       <div className="mb-8">
// //         <h3 className="text-xl font-semibold mb-4">Users</h3>
// //         <div className="mb-4 flex space-x-4">
// //           <div>
// //             <label className="mr-2">Filter by Role:</label>
// //             <select
// //               value={userFilter.role}
// //               onChange={(e) => {
// //                 setUserFilter({ ...userFilter, role: e.target.value });
// //                 setUserPage(1);
// //               }}
// //               className="p-2 border rounded"
// //             >
// //               <option value="">All</option>
// //               <option value="job_seeker">Job Seeker</option>
// //               <option value="employer">Employer</option>
// //               <option value="admin">Admin</option>
// //             </select>
// //           </div>
// //         </div>
// //         <ul className="space-y-4">
// //           {users.map((user) => (
// //             <li
// //               key={user.id}
// //               className="bg-white p-4 rounded shadow flex justify-between items-center"
// //             >
// //               <div>
// //                 <p className="font-semibold">{user.username}</p>
// //                 <p>
// //                   {user.email} ({user.role})
// //                 </p>
// //               </div>
// //               <div className="space-x-2">
// //                 <button
// //                   onClick={() => openEditUserModal(user)}
// //                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //                 >
// //                   Edit
// //                 </button>
// //                 <button
// //                   onClick={() => deleteUserHandler(user.id)}
// //                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
// //                 >
// //                   Delete
// //                 </button>
// //               </div>
// //             </li>
// //           ))}
// //         </ul>
// //         {userPagination &&
// //           renderPagination(userPage, userPagination.totalPages, setUserPage)}
// //       </div>

// //       {/* Jobs Section */}
// //       <div>
// //         <h3 className="text-xl font-semibold mb-4">Job Posts</h3>
// //         <div className="mb-4 flex space-x-4">
// //           <div>
// //             <label className="mr-2">Filter by Status:</label>
// //             <select
// //               value={jobFilter.is_active}
// //               onChange={(e) => {
// //                 setJobFilter({ ...jobFilter, is_active: e.target.value });
// //                 setJobPage(1);
// //               }}
// //               className="p-2 border rounded"
// //             >
// //               <option value="">All</option>
// //               <option value="true">Active</option>
// //               <option value="false">Inactive</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="mr-2">Filter by Category:</label>
// //             <input
// //               value={jobFilter.category}
// //               onChange={(e) => {
// //                 setJobFilter({ ...jobFilter, category: e.target.value });
// //                 setJobPage(1);
// //               }}
// //               placeholder="Category"
// //               className="p-2 border rounded"
// //             />
// //           </div>
// //         </div>
// //         <ul className="space-y-4">
// //           {jobs.map((job) => (
// //             <li
// //               key={job.id}
// //               className="bg-white p-4 rounded shadow flex justify-between items-center"
// //             >
// //               <div>
// //                 <p className="font-semibold">{job.title}</p>
// //                 <p>{job.company_name}</p>
// //               </div>
// //               <div className="space-x-2">
// //                 <button
// //                   onClick={() => openEditJobModal(job)}
// //                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //                 >
// //                   Edit
// //                 </button>
// //                 <button
// //                   onClick={() => deleteJobHandler(job.id)}
// //                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
// //                 >
// //                   Delete
// //                 </button>
// //               </div>
// //             </li>
// //           ))}
// //         </ul>
// //         {jobPagination &&
// //           renderPagination(jobPage, jobPagination.totalPages, setJobPage)}
// //       </div>

// //       {/* Edit User Modal */}
// //       {editUser && (
// //         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
// //           <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
// //             <h3 className="text-xl font-semibold mb-4">Edit User</h3>
// //             <form onSubmit={handleEditUser} className="space-y-4">
// //               <input
// //                 value={editUser.username}
// //                 onChange={(e) =>
// //                   setEditUser({ ...editUser, username: e.target.value })
// //                 }
// //                 placeholder="Username"
// //                 className="w-full p-2 border rounded"
// //               />
// //               <input
// //                 value={editUser.email}
// //                 onChange={(e) =>
// //                   setEditUser({ ...editUser, email: e.target.value })
// //                 }
// //                 placeholder="Email"
// //                 type="email"
// //                 className="w-full p-2 border rounded"
// //               />
// //               <input
// //                 value={editUser.password || ""}
// //                 onChange={(e) =>
// //                   setEditUser({ ...editUser, password: e.target.value })
// //                 }
// //                 placeholder="New Password (optional)"
// //                 type="password"
// //                 className="w-full p-2 border rounded"
// //               />
// //               <select
// //                 value={editUser.role}
// //                 onChange={(e) =>
// //                   setEditUser({ ...editUser, role: e.target.value })
// //                 }
// //                 className="w-full p-2 border rounded"
// //               >
// //                 <option value="job_seeker">Job Seeker</option>
// //                 <option value="employer">Employer</option>
// //                 <option value="admin">Admin</option>
// //               </select>
// //               <label className="flex items-center">
// //                 <input
// //                   type="checkbox"
// //                   checked={editUser.is_active}
// //                   onChange={(e) =>
// //                     setEditUser({ ...editUser, is_active: e.target.checked })
// //                   }
// //                   className="mr-2"
// //                 />
// //                 Active
// //               </label>
// //               <div className="flex space-x-2">
// //                 <button
// //                   type="submit"
// //                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //                   disabled={loading}
// //                 >
// //                   Save
// //                 </button>
// //                 <button
// //                   type="button"
// //                   onClick={() => setEditUser(null)}
// //                   className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
// //                 >
// //                   Cancel
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}

// //       {/* Edit Job Modal */}
// //       {editJob && (
// //         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
// //           <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
// //             <h3 className="text-xl font-semibold mb-4">Edit Job</h3>
// //             <form onSubmit={handleEditJob} className="space-y-4">
// //               <input
// //                 value={editJob.title}
// //                 onChange={(e) =>
// //                   setEditJob({ ...editJob, title: e.target.value })
// //                 }
// //                 placeholder="Title"
// //                 className="w-full p-2 border rounded"
// //               />
// //               <textarea
// //                 value={editJob.description}
// //                 onChange={(e) =>
// //                   setEditJob({ ...editJob, description: e.target.value })
// //                 }
// //                 placeholder="Description"
// //                 className="w-full p-2 border rounded"
// //                 rows="3"
// //               />
// //               <input
// //                 value={editJob.salary_min || ""}
// //                 onChange={(e) =>
// //                   setEditJob({ ...editJob, salary_min: e.target.value })
// //                 }
// //                 placeholder="Min Salary"
// //                 type="number"
// //                 className="w-full p-2 border rounded"
// //               />
// //               <input
// //                 value={editJob.salary_max || ""}
// //                 onChange={(e) =>
// //                   setEditJob({ ...editJob, salary_max: e.target.value })
// //                 }
// //                 placeholder="Max Salary"
// //                 type="number"
// //                 className="w-full p-2 border rounded"
// //               />
// //               <input
// //                 value={editJob.location || ""}
// //                 onChange={(e) =>
// //                   setEditJob({ ...editJob, location: e.target.value })
// //                 }
// //                 placeholder="Location"
// //                 className="w-full p-2 border rounded"
// //               />
// //               <input
// //                 value={editJob.address || ""}
// //                 onChange={(e) =>
// //                   setEditJob({ ...editJob, address: e.target.value })
// //                 }
// //                 placeholder="Address"
// //                 className="w-full p-2 border rounded"
// //               />
// //               <input
// //                 value={editJob.category || ""}
// //                 onChange={(e) =>
// //                   setEditJob({ ...editJob, category: e.target.value })
// //                 }
// //                 placeholder="Category"
// //                 className="w-full p-2 border rounded"
// //               />
// //               <input
// //                 value={editJob.application_deadline || ""}
// //                 onChange={(e) =>
// //                   setEditJob({
// //                     ...editJob,
// //                     application_deadline: e.target.value,
// //                   })
// //                 }
// //                 placeholder="Deadline (YYYY-MM-DD)"
// //                 type="date"
// //                 className="w-full p-2 border rounded"
// //               />
// //               <select
// //                 value={editJob.employment_type}
// //                 onChange={(e) =>
// //                   setEditJob({ ...editJob, employment_type: e.target.value })
// //                 }
// //                 className="w-full p-2 border rounded"
// //               >
// //                 <option value="full_time">Full Time</option>
// //                 <option value="part_time">Part Time</option>
// //                 <option value="contract">Contract</option>
// //                 <option value="internship">Internship</option>
// //                 <option value="apprenticeship">Apprenticeship</option>
// //               </select>
// //               <div>
// //                 <label className="block mb-1">Requirements</label>
// //                 <div className="flex mb-2">
// //                   <input
// //                     id="newRequirement"
// //                     placeholder="Add requirement"
// //                     className="w-full p-2 border rounded"
// //                     onKeyPress={(e) => {
// //                       if (e.key === "Enter") {
// //                         e.preventDefault();
// //                         addRequirement(e.target.value);
// //                         e.target.value = "";
// //                       }
// //                     }}
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       const req =
// //                         document.getElementById("newRequirement").value;
// //                       addRequirement(req);
// //                       document.getElementById("newRequirement").value = "";
// //                     }}
// //                     className="ml-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
// //                   >
// //                     Add
// //                   </button>
// //                 </div>
// //                 <ul className="space-y-1">
// //                   {editJob.requirements.map((req, index) => (
// //                     <li key={index} className="flex justify-between">
// //                       {req}
// //                       <button
// //                         onClick={() =>
// //                           setEditJob({
// //                             ...editJob,
// //                             requirements: editJob.requirements.filter(
// //                               (_, i) => i !== index
// //                             ),
// //                           })
// //                         }
// //                         className="text-red-500"
// //                       >
// //                         Remove
// //                       </button>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>
// //               <div>
// //                 <label className="block mb-1">Responsibilities</label>
// //                 <div className="flex mb-2">
// //                   <input
// //                     id="newResponsibility"
// //                     placeholder="Add responsibility"
// //                     className="w-full p-2 border rounded"
// //                     onKeyPress={(e) => {
// //                       if (e.key === "Enter") {
// //                         e.preventDefault();
// //                         addResponsibility(e.target.value);
// //                         e.target.value = "";
// //                       }
// //                     }}
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       const resp =
// //                         document.getElementById("newResponsibility").value;
// //                       addResponsibility(resp);
// //                       document.getElementById("newResponsibility").value = "";
// //                     }}
// //                     className="ml-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
// //                   >
// //                     Add
// //                   </button>
// //                 </div>
// //                 <ul className="space-y-1">
// //                   {editJob.responsibilities.map((resp, index) => (
// //                     <li key={index} className="flex justify-between">
// //                       {resp}
// //                       <button
// //                         onClick={() =>
// //                           setEditJob({
// //                             ...editJob,
// //                             responsibilities: editJob.responsibilities.filter(
// //                               (_, i) => i !== index
// //                             ),
// //                           })
// //                         }
// //                         className="text-red-500"
// //                       >
// //                         Remove
// //                       </button>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>
// //               <label className="flex items-center">
// //                 <input
// //                   type="checkbox"
// //                   checked={editJob.is_active}
// //                   onChange={(e) =>
// //                     setEditJob({ ...editJob, is_active: e.target.checked })
// //                   }
// //                   className="mr-2"
// //                 />
// //                 Active
// //               </label>
// //               <div className="flex space-x-2">
// //                 <button
// //                   type="submit"
// //                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //                   disabled={loading}
// //                 >
// //                   Save
// //                 </button>
// //                 <button
// //                   type="button"
// //                   onClick={() => setEditJob(null)}
// //                   className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
// //                 >
// //                   Cancel
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AdminDashboard;

// // // import React, { useEffect, useState } from "react";
// // // import { useDispatch, useSelector } from "react-redux";
// // // import {
// // //   fetchUsers,
// // //   createUser,
// // //   updateUser,
// // //   deleteUser,
// // //   fetchJobs,
// // //   updateJob,
// // //   deleteJob,
// // //   fetchAnalytics,
// // // } from "../redux/slice/adminSlice";

// // // const AdminDashboard = () => {
// // //   const dispatch = useDispatch();
// // //   const { users, jobs, analytics, loading, error } = useSelector(
// // //     (state) => state.admin
// // //   );

// // //   const [newUser, setNewUser] = useState({
// // //     username: "",
// // //     email: "",
// // //     password: "",
// // //     role: "job_seeker",
// // //   });

// // //   useEffect(() => {
// // //     dispatch(fetchUsers({ page: 1, limit: 10 }));
// // //     dispatch(fetchJobs({ page: 1, limit: 10 }));
// // //     dispatch(fetchAnalytics());
// // //   }, [dispatch]);

// // //   const handleCreateUser = (e) => {
// // //     e.preventDefault();
// // //     dispatch(createUser(newUser)).then(() => {
// // //       setNewUser({ username: "", email: "", password: "", role: "job_seeker" });
// // //       dispatch(fetchUsers({ page: 1, limit: 10 }));
// // //     });
// // //   };

// // //   const toggleUserStatus = (id, is_active) => {
// // //     dispatch(updateUser({ id, data: { is_active: !is_active } }));
// // //   };

// // //   const deleteUserHandler = (id) => {
// // //     if (window.confirm("Are you sure you want to delete this user?")) {
// // //       dispatch(deleteUser(id));
// // //     }
// // //   };

// // //   const toggleJobStatus = (id, is_active) => {
// // //     dispatch(updateJob({ id, data: { is_active: !is_active } }));
// // //   };

// // //   const deleteJobHandler = (id) => {
// // //     if (window.confirm("Are you sure you want to delete this job?")) {
// // //       dispatch(deleteJob(id));
// // //     }
// // //   };

// // //   return (
// // //     <div className="p-6">
// // //       <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
// // //       {loading && <p className="text-gray-500">Loading...</p>}
// // //       {error && (
// // //         <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
// // //           <p>{error}</p>
// // //         </div>
// // //       )}

// // //       {/* Analytics */}
// // //       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
// // //         <div className="bg-white p-4 rounded shadow">
// // //           <h3 className="text-xl font-semibold">Total Users</h3>
// // //           <p className="text-2xl">{analytics.total_users}</p>
// // //         </div>
// // //         <div className="bg-white p-4 rounded shadow">
// // //           <h3 className="text-xl font-semibold">Total Jobs</h3>
// // //           <p className="text-2xl">{analytics.total_jobs}</p>
// // //         </div>
// // //         <div className="bg-white p-4 rounded shadow">
// // //           <h3 className="text-xl font-semibold">Total Applications</h3>
// // //           <p className="text-2xl">{analytics.total_applications}</p>
// // //         </div>
// // //       </div>

// // //       {/* Create User */}
// // //       <div className="mb-8">
// // //         <h3 className="text-xl font-semibold mb-4">Create New User</h3>
// // //         <form
// // //           onSubmit={handleCreateUser}
// // //           className="grid grid-cols-1 md:grid-cols-4 gap-4"
// // //         >
// // //           <input
// // //             value={newUser.username}
// // //             onChange={(e) =>
// // //               setNewUser({ ...newUser, username: e.target.value })
// // //             }
// // //             placeholder="Username"
// // //             className="p-2 border rounded"
// // //             required
// // //           />
// // //           <input
// // //             value={newUser.email}
// // //             onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
// // //             placeholder="Email"
// // //             type="email"
// // //             className="p-2 border rounded"
// // //             required
// // //           />
// // //           <input
// // //             value={newUser.password}
// // //             onChange={(e) =>
// // //               setNewUser({ ...newUser, password: e.target.value })
// // //             }
// // //             placeholder="Password"
// // //             type="password"
// // //             className="p-2 border rounded"
// // //             required
// // //           />
// // //           <select
// // //             value={newUser.role}
// // //             onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
// // //             className="p-2 border rounded"
// // //           >
// // //             <option value="job_seeker">Job Seeker</option>
// // //             <option value="employer">Employer</option>
// // //             <option value="admin">Admin</option>
// // //           </select>
// // //           <button
// // //             type="submit"
// // //             className="md:col-span-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// // //             disabled={loading}
// // //           >
// // //             Create User
// // //           </button>
// // //         </form>
// // //       </div>

// // //       {/* Users List */}
// // //       <div className="mb-8">
// // //         <h3 className="text-xl font-semibold mb-4">Users</h3>
// // //         <ul className="space-y-4">
// // //           {users.map((user) => (
// // //             <li
// // //               key={user.id}
// // //               className="bg-white p-4 rounded shadow flex justify-between items-center"
// // //             >
// // //               <div>
// // //                 <p className="font-semibold">{user.username}</p>
// // //                 <p>
// // //                   {user.email} ({user.role})
// // //                 </p>
// // //               </div>
// // //               <div className="space-x-2">
// // //                 <button
// // //                   onClick={() => toggleUserStatus(user.id, user.is_active)}
// // //                   className={`px-4 py-2 rounded text-white ${
// // //                     user.is_active
// // //                       ? "bg-red-500 hover:bg-red-600"
// // //                       : "bg-green-500 hover:bg-green-600"
// // //                   }`}
// // //                 >
// // //                   {user.is_active ? "Suspend" : "Activate"}
// // //                 </button>
// // //                 <button
// // //                   onClick={() => deleteUserHandler(user.id)}
// // //                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
// // //                 >
// // //                   Delete
// // //                 </button>
// // //               </div>
// // //             </li>
// // //           ))}
// // //         </ul>
// // //       </div>

// // //       {/* Jobs List */}
// // //       <div>
// // //         <h3 className="text-xl font-semibold mb-4">Job Posts</h3>
// // //         <ul className="space-y-4">
// // //           {jobs.map((job) => (
// // //             <li
// // //               key={job.id}
// // //               className="bg-white p-4 rounded shadow flex justify-between items-center"
// // //             >
// // //               <div>
// // //                 <p className="font-semibold">{job.title}</p>
// // //                 <p>{job.company_name}</p>
// // //               </div>
// // //               <div className="space-x-2">
// // //                 <button
// // //                   onClick={() => toggleJobStatus(job.id, job.is_active)}
// // //                   className={`px-4 py-2 rounded text-white ${
// // //                     job.is_active
// // //                       ? "bg-red-500 hover:bg-red-600"
// // //                       : "bg-green-500 hover:bg-green-600"
// // //                   }`}
// // //                 >
// // //                   {job.is_active ? "Deactivate" : "Approve"}
// // //                 </button>
// // //                 <button
// // //                   onClick={() => deleteJobHandler(job.id)}
// // //                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
// // //                 >
// // //                   Delete
// // //                 </button>
// // //               </div>
// // //             </li>
// // //           ))}
// // //         </ul>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AdminDashboard;
