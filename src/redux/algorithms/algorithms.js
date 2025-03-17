// import express from "express";
// import multer from "multer";
// import { sql_db } from "../db/db.js";
// import fs from "fs";
// import path from "path";
// import authenticate from "../middleware/authenticate.js";

// const router = express.Router();

// // Configure multer for file upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "resume_uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, "lab_" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// // Route to upload a resume
// router.post("/upload", authenticate, upload.single("file"), (req, res) => {
//   const user_id = req.user.id;
//   const file_path = req.file.path;
//   const file_name = req.file.filename;
//   const file_type = req.file.mimetype;

//   console.log(req.file);

//   const query =
//     "INSERT INTO userResume (user_id, file_path, file_name, file_type) VALUES (?, ?, ?, ?)";
//   sql_db.query(
//     query,
//     [user_id, file_path, file_name, file_type],
//     (err, result) => {
//       if (err) {
//         console.error("Error inserting resume:", err);
//         return res.status(500).json({ error: "Failed to upload resume" });
//       }
//       res.status(200).json({
//         message: "Resume uploaded successfully",
//         fileId: result.insertId,
//       });
//     }
//   );
// });

// router.post("/submit-resume", async (req, res) => {
//   const resumeData = req.body; // Get the submitted resume data
//   console.log(JSON.stringify(resumeData));
//   // this type is for making profile resume in frontend
//   //   // try {
//   //   const query = `INSERT INTO resumes (data) VALUES (?)`;
//   //   sql_db.query(query, [JSON.stringify(resumeData)], (err, result) => {
//   //     if (err) {
//   //       console.error("Error inserting resume:", err);
//   //       return res.status(500).json({ error: "Failed to write resume" });
//   //     }
//   //     res.status(200).json({ message: "Resume update successfully" });
//   //   });
//   // } catch (error) {
//   //   console.error(error);
//   //   res.status(500).json({ message: "Error submitting resume" });
//   // }
// });

// // Route to fetch the latest resume for the logged-in user
// router.get("/resume", authenticate, (req, res) => {
//   const userId = req.user.id;
//   const query =
//     "SELECT * FROM userResume WHERE user_id = ? ORDER BY id DESC LIMIT 1";
//   sql_db.query(query, [userId], (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: "Failed to fetch resumes" });
//     }
//     res.status(200).json(results);
//   });
// });

// router.get("/resumeID", authenticate, (req, res) => {
//   const userId = req.user.id;
//   const query =
//     "SELECT id,file_name FROM userResume WHERE user_id = ? ORDER BY id DESC LIMIT 1";
//   sql_db.query(query, [userId], (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: "Failed to fetch resumes" });
//     }
//     console.log(results);
//     res.status(200).json(results);
//   });
// });

// router.get("/pdf/:filename", authenticate, (req, res) => {
//   const filename = req.params.filename;
//   const filePath = path.join("resume_uploads", filename);

//   fs.readFile(filePath, (err, data) => {
//     if (err) {
//       console.error("Error reading file:", err);
//       res.status(404).send("File not found");
//     } else {
//       // res.cookie("pdfURL", data);
//       console.log("Serving file:", filePath);
//       res.setHeader("Content-Type", "application/pdf");
//       res.send(data);
//     }
//   });
// });

// export default router;
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Document, Page, pdfjs } from "react-pdf";
// import {
//   uploadResume,
//   fetchResume,
//   previewResume,
// } from "../../redux/rdx_/resume/resumeSlice";

// import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // Required styles
// import "react-pdf/dist/esm/Page/TextLayer.css"; // Optional for text highlighting
// import { Link } from "react-router-dom";
// import Dash from "../dash/Dash";

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// const ResumeUploader = () => {
//   const dispatch = useDispatch();

//   const [file, setFile] = useState(null);
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const { data, fileURL, uploadStatus, fetchStatus, previewStatus, error } =
//     useSelector((state) => state.resume);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = () => {
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("file", file);
//     dispatch(uploadResume(formData));
//   };

//   const handleFetchResume = () => {
//     dispatch(fetchResume());
//   };

//   const handlePreview = (filename) => {
//     dispatch(previewResume(filename));
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//     setPageNumber(1);
//   };

//   const nextPage = () => {
//     if (pageNumber < numPages) setPageNumber(pageNumber + 1);
//   };

//   const prevPage = () => {
//     if (pageNumber > 1) setPageNumber(pageNumber - 1);
//   };

//   return (
//     <>
//       <Dash>
//         <Link
//           to="/dashboard"
//           className="mb-4 hover:bg-sky-900 p-2  text-center border border-sky-900 border-b-4"
//         >
//           dashboard
//         </Link>
//         <div className="max-w-3xl mx-auto p-6 backdrop-blur-lg dark:text-white rounded-lg shadow-md">
//           {/* Main container */}
//           <h1 className="text-2xl font-bold mb-4">Resume Uploader</h1>
//           <div className="mb-4">
//             {/* File input and upload button */}
//             <input
//               type="file"
//               accept="application/pdf"
//               onChange={handleFileChange}
//               className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               onClick={handleUpload}
//               className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
//             >
//               Upload Resume
//             </button>
//           </div>
//           <button
//             onClick={handleFetchResume}
//             className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
//           >
//             Fetch Latest Resume
//           </button>
//           {/* Status messages */}
//           {uploadStatus === "loading" && (
//             <p className="text-blue-500">Uploading...</p>
//           )}
//           {uploadStatus === "succeeded" && (
//             <p className="text-green-500">Resume uploaded successfully!</p>
//           )}
//           {uploadStatus === "failed" && (
//             <p className="text-red-500">Error: {error}</p>
//           )}
//           {fetchStatus === "loading" && (
//             <p className="text-blue-500">Fetching latest resume...</p>
//           )}
//           {fetchStatus === "succeeded" && data[0]?.file_name && (
//             <div className="border border-gray-200 rounded-md p-4 mb-4">
//               <h3 className="text-lg font-semibold mb-2 ">Latest Resume</h3>
//               <p className="">
//                 <strong>File Name:</strong> {data[0].file_name}
//               </p>
//               <button
//                 onClick={() => handlePreview(data[0].file_name)}
//                 className="mt-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
//               >
//                 Preview Resume
//               </button>
//             </div>
//           )}
//           {fetchStatus === "failed" && (
//             <p className="text-red-500">Error: {error}</p>
//           )}
//           {/* PDF Preview */}
//           {previewStatus === "loading" && (
//             <p className="text-blue-500">Loading PDF...</p>
//           )}
//           <div className="">
//             {/* className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50" */}
//             {previewStatus === "succeeded" && fileURL && (
//               <div className="border border-gray-200 rounded-md p-4">
//                 <h3 className="text-lg font-semibold mb-2 ">PDF Preview</h3>
//                 <div className="overflow-x-auto">
//                   {/* Added for horizontal scrolling */}
//                   <Document
//                     file={fileURL}
//                     onLoadSuccess={onDocumentLoadSuccess}
//                   >
//                     {/* <Page pageNumber={pageNumber} /> */}
//                     <Page
//                       pageNumber={pageNumber}
//                       renderAnnotationLayer={true}
//                     />
//                   </Document>
//                 </div>
//                 <div className="flex justify-between mt-4">
//                   <button
//                     onClick={prevPage}
//                     disabled={pageNumber === 1}
//                     className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   <p className="text-gray-600">
//                     Page {pageNumber} of {numPages}
//                   </p>
//                   <button
//                     onClick={nextPage}
//                     disabled={pageNumber === numPages}
//                     className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </Dash>
//     </>
//   );
// };

// export default ResumeUploader;
