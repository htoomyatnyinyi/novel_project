import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  fetchResumes,
  clearFileUrl,
  fetchfileResume,
} from "../redux/slice/jobSeekerSlice.js";
import { Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set up pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ProfilePage = () => {
  const dispatch = useDispatch();
  // const { profile, resumes } = useSelector((state) => state.jobSeeker);
  const { profile, resumes, fileUrl, loading, error } = useSelector(
    (state) => state.jobSeeker
  );
  const [previewResumeId, setPreviewResumeId] = useState(null);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchResumes()); // Fetch resumes to show on profile
  }, [dispatch]);

  const handlePreviewResume = (resumeId, filename) => {
    if (previewResumeId === resumeId) {
      setPreviewResumeId(null);
      dispatch(clearFileUrl());
      setNumPages(null);
    } else {
      setPreviewResumeId(resumeId);
      dispatch(fetchfileResume(filename));
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-cyan-900 p-4 sm:p-6">
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Profile Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            It seems you haven’t created a profile yet. Head to your dashboard
            to get started!
          </p>
          <Link
            to="/job_seeker"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-cyan-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          My Profile
        </h2>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                First Name
              </p>
              <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                {profile.first_name}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Last Name
              </p>
              <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                {profile.last_name}
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
                Gender
              </p>
              <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                {profile.gender || "Not specified"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Date of Birth
              </p>
              <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                {profile.date_of_birth || "Not specified"}
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
            <div className="space-y-2 sm:col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Bio
              </p>
              <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                {profile.bio || "Not specified"}
              </p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Created At
              </p>
              <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          {/* Resume Section */}
          <div className="mt-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              My Resumes
            </h3>
            {error && (
              <p className="text-red-500 text-sm mb-4">Error: {error}</p>
            )}
            {resumes.length > 0 ? (
              <ul className="space-y-3">
                {resumes.map((resume) => (
                  <li
                    key={resume.id}
                    className="flex flex-col p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
                      <span className="text-sm text-gray-900 dark:text-white mb-2 sm:mb-0 break-all">
                        {resume.file_name}
                      </span>
                      <button
                        onClick={() =>
                          handlePreviewResume(resume.id, resume.file_name)
                        }
                        disabled={loading && previewResumeId === resume.id}
                        className={`px-3 py-1 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ${
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
                    </div>
                    {previewResumeId === resume.id && fileUrl && (
                      <div className="mt-3 border border-gray-300 shadow-md p-3 bg-white dark:bg-gray-900 rounded-lg">
                        <Document
                          file={fileUrl}
                          onLoadSuccess={onDocumentLoadSuccess}
                          onLoadError={(error) =>
                            console.error("PDF Load Error:", error)
                          }
                          loading={
                            <p className="text-gray-500 text-sm">
                              Loading PDF...
                            </p>
                          }
                          error={
                            <p className="text-red-500 text-sm">
                              Failed to load PDF
                            </p>
                          }
                        >
                          {numPages &&
                            Array.from(new Array(numPages), (el, index) => (
                              <Page
                                key={index}
                                pageNumber={index + 1}
                                width={Math.min(300, window.innerWidth - 40)} // Adjust for mobile
                                className="mb-3"
                              />
                            ))}
                        </Document>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                No resumes uploaded yet. Add one in your dashboard!
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/job_seeker/edit-profile"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; // import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProfile } from "../redux/slice/jobSeekerSlice.js";
// import { Link } from "react-router-dom";

// const ProfilePage = () => {
//   const dispatch = useDispatch();
//   const { profile } = useSelector((state) => state.jobSeeker);

//   useEffect(() => {
//     dispatch(fetchProfile());
//   }, [dispatch]);

//   if (!profile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-cyan-900 p-4 sm:p-6">
//         <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full text-center">
//           <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
//             Profile Not Found
//           </h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-6">
//             It seems you haven’t created a profile yet. Head to your dashboard
//             to get started!
//           </p>
//           <Link
//             to="/job_seeker"
//             className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
//           >
//             Go to Dashboard
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-cyan-900 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
//           My Profile
//         </h2>
//         <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-xl">
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//                 First Name
//               </p>
//               <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
//                 {profile.first_name}
//               </p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//                 Last Name
//               </p>
//               <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
//                 {profile.last_name}
//               </p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//                 Phone
//               </p>
//               <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
//                 {profile.phone}
//               </p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//                 Gender
//               </p>
//               <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
//                 {profile.gender || "Not specified"}
//               </p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//                 Date of Birth
//               </p>
//               <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
//                 {profile.date_of_birth || "Not specified"}
//               </p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//                 Location
//               </p>
//               <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
//                 {profile.location || "Not specified"}
//               </p>
//             </div>
//             <div className="space-y-2 sm:col-span-2">
//               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//                 Bio
//               </p>
//               <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
//                 {profile.bio || "Not specified"}
//               </p>
//             </div>
//             <div className="space-y-2 sm:col-span-2">
//               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//                 Created At
//               </p>
//               <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
//                 {new Date(profile.created_at).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//           <div className="mt-8 flex justify-center">
//             <Link
//               to="/job_seeker/edit-profile"
//               className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
//             >
//               Edit Profile
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage; // import React, { useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { fetchProfile } from "../redux/slice/jobSeekerSlice.js";
// // import { Link } from "react-router-dom";

// // const ProfilePage = () => {
// //   const dispatch = useDispatch();
// //   const { profile } = useSelector((state) => state.jobSeeker);

// //   useEffect(() => {
// //     dispatch(fetchProfile());
// //   }, [dispatch]);

// //   if (!profile) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-cyan-900 p-6">
// //         <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
// //           <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
// //             Profile Not Found
// //           </h2>
// //           <p className="text-gray-600 dark:text-gray-300 mb-6">
// //             It seems you haven’t created a profile yet. Head to your dashboard
// //             to get started!
// //           </p>
// //           <Link
// //             to="/job_seeker"
// //             className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
// //           >
// //             Go to Dashboard
// //           </Link>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-100 dark:bg-cyan-900 py-12 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-3xl mx-auto">
// //         <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
// //           My Profile
// //         </h2>
// //         <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 transition-all duration-300 hover:shadow-xl">
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <div className="space-y-2">
// //               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
// //                 First Name
// //               </p>
// //               <p className="text-lg font-medium text-gray-900 dark:text-white">
// //                 {profile.first_name}
// //               </p>
// //             </div>
// //             <div className="space-y-2">
// //               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
// //                 Last Name
// //               </p>
// //               <p className="text-lg font-medium text-gray-900 dark:text-white">
// //                 {profile.last_name}
// //               </p>
// //             </div>
// //             <div className="space-y-2">
// //               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
// //                 Phone
// //               </p>
// //               <p className="text-lg font-medium text-gray-900 dark:text-white">
// //                 {profile.phone}
// //               </p>
// //             </div>
// //             <div className="space-y-2">
// //               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
// //                 Gender
// //               </p>
// //               <p className="text-lg font-medium text-gray-900 dark:text-white">
// //                 {profile.gender || "Not specified"}
// //               </p>
// //             </div>
// //             <div className="space-y-2">
// //               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
// //                 Date of Birth
// //               </p>
// //               <p className="text-lg font-medium text-gray-900 dark:text-white">
// //                 {profile.date_of_birth || "Not specified"}
// //               </p>
// //             </div>
// //             <div className="space-y-2">
// //               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
// //                 Location
// //               </p>
// //               <p className="text-lg font-medium text-gray-900 dark:text-white">
// //                 {profile.location || "Not specified"}
// //               </p>
// //             </div>
// //             <div className="col-span-1 md:col-span-2 space-y-2">
// //               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
// //                 Bio
// //               </p>
// //               <p className="text-lg font-medium text-gray-900 dark:text-white">
// //                 {profile.bio || "Not specified"}
// //               </p>
// //             </div>
// //             <div className="col-span-1 md:col-span-2 space-y-2">
// //               <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
// //                 Created At
// //               </p>
// //               <p className="text-lg font-medium text-gray-900 dark:text-white">
// //                 {new Date(profile.created_at).toLocaleDateString()}
// //               </p>
// //             </div>
// //           </div>
// //           <div className="mt-8 text-center">
// //             <Link
// //               to="/job_seeker"
// //               className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
// //             >
// //               Edit Profile
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfilePage; // import React, { useEffect } from "react";
// // // import { useDispatch, useSelector } from "react-redux";
// // // // import { fetchProfile } from "../redux/slice/jobSeekerSlice.js";
// // // import { fetchProfile } from "../redux/slice/jobSeekerSlice.js";
// // // import { Link } from "react-router-dom";

// // // const ProfilePage = () => {
// // //   const dispatch = useDispatch();
// // //   const { profile } = useSelector((state) => state.jobSeeker);

// // //   useEffect(() => {
// // //     dispatch(fetchProfile());
// // //   }, [dispatch]);

// // //   if (!profile) {
// // //     return (
// // //       <div className="p-6">
// // //         <h2 className="text-2xl font-bold mb-4">Profile</h2>
// // //         <p>No profile found. Please create one in the dashboard.</p>
// // //         <Link
// // //           to="/job-seeker/dashboard"
// // //           className="mt-4 inline-block p-2 bg-blue-500 text-white rounded"
// // //         >
// // //           Go to Dashboard
// // //         </Link>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="p-6 max-w-2xl mx-auto">
// // //       <h2 className="text-2xl font-bold mb-6">My Profile</h2>
// // //       <div className="bg-white shadow rounded-lg p-6">
// // //         <div className="grid grid-cols-2 gap-4">
// // //           <div>
// // //             <p className="text-gray-600">First Name</p>
// // //             <p className="font-medium">{profile.first_name}</p>
// // //           </div>
// // //           <div>
// // //             <p className="text-gray-600">Last Name</p>
// // //             <p className="font-medium">{profile.last_name}</p>
// // //           </div>
// // //           <div>
// // //             <p className="text-gray-600">Phone</p>
// // //             <p className="font-medium">{profile.phone}</p>
// // //           </div>
// // //           <div>
// // //             <p className="text-gray-600">Gender</p>
// // //             <p className="font-medium">{profile.gender || "Not specified"}</p>
// // //           </div>
// // //           <div>
// // //             <p className="text-gray-600">Date of Birth</p>
// // //             <p className="font-medium">
// // //               {profile.date_of_birth || "Not specified"}
// // //             </p>
// // //           </div>
// // //           <div>
// // //             <p className="text-gray-600">Location</p>
// // //             <p className="font-medium">{profile.location || "Not specified"}</p>
// // //           </div>
// // //           <div className="col-span-2">
// // //             <p className="text-gray-600">Bio</p>
// // //             <p className="font-medium">{profile.bio || "Not specified"}</p>
// // //           </div>
// // //           <div className="col-span-2">
// // //             <p className="text-gray-600">Created At</p>
// // //             <p className="font-medium">
// // //               {new Date(profile.created_at).toLocaleDateString()}
// // //             </p>
// // //           </div>
// // //         </div>
// // //         <Link
// // //           to="/job_seeker"
// // //           className="mt-6 inline-block p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// // //         >
// // //           Edit Profile
// // //         </Link>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default ProfilePage;
