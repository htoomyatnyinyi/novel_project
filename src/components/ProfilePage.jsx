import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchProfile } from "../redux/slice/jobSeekerSlice.js";
import { fetchProfile } from "../redux/slice/jobSeekerSlice.js";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.jobSeeker);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (!profile) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p>No profile found. Please create one in the dashboard.</p>
        <Link
          to="/job-seeker/dashboard"
          className="mt-4 inline-block p-2 bg-blue-500 text-white rounded"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">First Name</p>
            <p className="font-medium">{profile.first_name}</p>
          </div>
          <div>
            <p className="text-gray-600">Last Name</p>
            <p className="font-medium">{profile.last_name}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone</p>
            <p className="font-medium">{profile.phone}</p>
          </div>
          <div>
            <p className="text-gray-600">Gender</p>
            <p className="font-medium">{profile.gender || "Not specified"}</p>
          </div>
          <div>
            <p className="text-gray-600">Date of Birth</p>
            <p className="font-medium">
              {profile.date_of_birth || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Location</p>
            <p className="font-medium">{profile.location || "Not specified"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-600">Bio</p>
            <p className="font-medium">{profile.bio || "Not specified"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-600">Created At</p>
            <p className="font-medium">
              {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Link
          to="/job_seeker"
          className="mt-6 inline-block p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
