import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchfileResume, fetchResumes } from "../redux/slice/jobSeekerSlice";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PreviewFile = () => {
  const dispatch = useDispatch();
  const { resumes, fileUrl, loading, error } = useSelector(
    (state) => state.jobSeeker
  );
  const [numPages, setNumPages] = useState(null);
  const resume = resumes.length > 0 ? resumes[0] : null;

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const handlePreview = () => {
    if (resume?.file_name) {
      dispatch(fetchfileResume(resume.file_name));
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Resume Preview</h1>
      {!resume && !loading && (
        <p className="text-gray-500">
          No resumes found. Please upload one first.
        </p>
      )}
      {resume && (
        <button
          onClick={handlePreview}
          disabled={loading}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : "Preview Resume"}
        </button>
      )}
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {fileUrl && (
        <div className="mt-4 border border-gray-300 shadow-md p-4 bg-white">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error("PDF Load Error:", error)}
            loading={<p className="text-gray-500">Loading PDF...</p>}
            error={
              <p className="text-red-500">
                Failed to load PDF. Check the file.
              </p>
            }
          >
            {numPages &&
              Array.from(new Array(numPages), (el, index) => (
                <Page key={index} pageNumber={index + 1} className="mb-4" />
              ))}
          </Document>
        </div>
      )}
    </div>
  );
};

export default PreviewFile; // import React, { useEffect, useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchfileResume, fetchResumes } from "../redux/slice/jobSeekerSlice";

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// const PreviewFile = () => {
//   const dispatch = useDispatch();
//   const { resumes, fileUrl, loading, error } = useSelector(
//     (state) => state.jobSeeker
//   );
//   const [numPages, setNumPages] = useState(null);

//   // Get the first resume (or modify to select a specific one)
//   const resume = resumes.length > 0 ? resumes[0] : null;

//   useEffect(() => {
//     // Fetch list of resumes on component mount
//     dispatch(fetchResumes());
//   }, [dispatch]);

//   const handlePreview = () => {
//     if (resume?.file_name) {
//       dispatch(fetchfileResume(resume.file_name));
//     }
//   };

//   console.log("fileUrl:", fileUrl); // Add this to debug
//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Resume Preview</h1>

//       {!resume && !loading && (
//         <p className="text-gray-500">
//           No resumes found. Please upload one first.
//         </p>
//       )}

//       {resume && (
//         <button
//           onClick={handlePreview}
//           disabled={loading}
//           className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 ${
//             loading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {loading ? "Loading..." : "Preview Resume"}
//         </button>
//       )}

//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       {fileUrl && (
//         <div className="mt-4 border border-gray-300 shadow-md p-4 bg-white">
//           <Document
//             file={fileUrl}
//             onLoadSuccess={onDocumentLoadSuccess}
//             loading={<p className="text-gray-500">Loading PDF...</p>}
//             error={<p className="text-red-500">Failed to load PDF</p>}
//           >
//             {numPages &&
//               Array.from(new Array(numPages), (el, index) => (
//                 <Page
//                   key={index}
//                   pageNumber={index + 1}
//                   className="mb-4"
//                   renderTextLayer={false} // Optional: disable text layer if not needed
//                   renderAnnotationLayer={false} // Optional: disable annotations
//                 />
//               ))}
//           </Document>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PreviewFile; // import React, { useEffect, useState } from "react";
// // import { Document, Page, pdfjs } from "react-pdf";
// // import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// // import "react-pdf/dist/esm/Page/TextLayer.css";
// // import { useDispatch, useSelector } from "react-redux";
// // import { fetchfileResume, fetchResumes } from "../redux/slice/jobSeekerSlice";

// // // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
// // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// // const PreviewFile = () => {
// //   const dispatch = useDispatch();
// //   const { resumes, fileUrl, loading, error } = useSelector(
// //     (state) => state.jobSeeker
// //   );
// //   const [numPages, setNumPages] = useState(null);

// //   const info = resumes.length > 0 ? resumes[0] : null;

// //   useEffect(() => {
// //     dispatch(fetchResumes());
// //   }, [dispatch]);

// //   const handlePreview = () => {
// //     if (info?.file_name) {
// //       dispatch(fetchfileResume(info.file_name));
// //     }
// //   };

// //   const onDocumentLoadSuccess = ({ numPages }) => {
// //     setNumPages(numPages);
// //   };

// //   return (
// //     <div className="p-4">
// //       <h1 className="text-xl font-bold mb-4">Preview Resume</h1>
// //       <button
// //         onClick={handlePreview}
// //         disabled={loading}
// //         className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
// //           loading ? "opacity-50 cursor-not-allowed" : ""
// //         }`}
// //       >
// //         {loading ? "Loading..." : "Preview Resume"}
// //       </button>

// //       {error && <p className="text-red-500 mt-2">{error}</p>}

// //       {fileUrl && (
// //         <div className="mt-4 border border-gray-300 shadow-md p-2">
// //           <Document
// //             file={fileUrl}
// //             onLoadSuccess={onDocumentLoadSuccess}
// //             loading={<p>Loading PDF...</p>}
// //             error={<p>Failed to load PDF</p>}
// //           >
// //             {numPages &&
// //               Array.from(new Array(numPages), (el, index) => (
// //                 <Page key={index} pageNumber={index + 1} />
// //               ))}
// //           </Document>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default PreviewFile; // import React, { useEffect, useState } from "react";
// // // import { Document, Page, pdfjs } from "react-pdf";
// // // import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // Required styles
// // // import "react-pdf/dist/esm/Page/TextLayer.css"; // Optional for text highlighting
// // // import { useDispatch, useSelector } from "react-redux";
// // // import { fetchfileResume, fetchResumes } from "../redux/slice/jobSeekerSlice";

// // // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// // // const PreviewFile = () => {
// // //   const dispatch = useDispatch();
// // //   const resumes = useSelector((state) => state.jobSeeker.resumes);
// // //   const fileUrl = useSelector((state) => state.jobSeeker.fileResumeUrl);
// // //   const [numPages, setNumPages] = useState(null);

// // //   const info = resumes.length > 0 ? resumes[0] : null;

// // //   useEffect(() => {
// // //     dispatch(fetchResumes());
// // //   }, [dispatch]);

// // //   const handlePreview = () => {
// // //     if (info?.file_name) {
// // //       dispatch(fetchfileResume(info.file_name));
// // //     }
// // //   };

// // //   return (
// // //     <div className="p-4">
// // //       <h1 className="text-xl font-bold mb-4">Preview Resume</h1>
// // //       <button
// // //         onClick={handlePreview}
// // //         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
// // //       >
// // //         Preview Resume
// // //       </button>

// // //       {fileUrl && (
// // //         <div className="mt-4 border border-gray-300 shadow-md p-2">
// // //           <Document
// // //             file={fileUrl}
// // //             onLoadSuccess={({ numPages }) => setNumPages(numPages)}
// // //           >
// // //             {Array.from(new Array(numPages), (el, index) => (
// // //               <Page key={index} pageNumber={index + 1} />
// // //             ))}
// // //           </Document>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default PreviewFile;
// // // // import React, { useEffect } from "react";
// // // // import { Document, Page, pdfjs } from "react-pdf";
// // // // import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // Required styles
// // // // import "react-pdf/dist/esm/Page/TextLayer.css"; // Optional for text highlighting
// // // // import { useDispatch, useSelector } from "react-redux";

// // // // import { fetchfileResume, fetchResumes } from "../redux/slice/jobSeekerSlice";

// // // // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// // // // const PreviewFile = () => {
// // // //   const dispatch = useDispatch();
// // // //   const [info] = useSelector((state) => state.jobSeeker.resumes);
// // // //   console.log(info.file_name, " info");

// // // //   useEffect(() => {
// // // //     dispatch(fetchResumes());
// // // //   }, [dispatch]);

// // // //   const handlePreview = (filename) => {
// // // //     dispatch(fetchfileResume(filename));
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <h1>Preview Resume</h1>
// // // //       <div>
// // // //         <button
// // // //           onClick={() => handlePreview(info.file_name)}
// // // //           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
// // // //         >
// // // //           Preview Resume
// // // //         </button>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default PreviewFile;
