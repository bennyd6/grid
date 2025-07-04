import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileUpload, FaKeyboard } from 'react-icons/fa';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false); // New state for upload loading
  const [uploadError, setUploadError] = useState(null); // New state for upload error

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadError(null); // Clear previous errors
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file before submitting.');
      return;
    }

    setUploading(true);
    setUploadError(null); // Clear previous errors
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const res = await axios.post('http://localhost:3000/upload', formData);
      const parsedData = res.data?.parsedData;

      setShowModal(false);
      setSelectedFile(null); // Clear selected file after successful upload
      navigate('/details', { state: { parsedData } }); // Pass parsed data
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError('Resume upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="./src/assets/bg-1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70 z-0 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 py-8 md:py-16"> {/* Reverted text color to white */}
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 drop-shadow-xl" // Reverted gradient for dark background
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to <span className="grid-word-effect glow-text">Grid</span> {/* Applied new class for grid effect */}
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-12 text-center max-w-3xl text-gray-200 leading-relaxed" // Reverted text color to lighter gray
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Generate a stunning, professional portfolio in minutes. Seamlessly transform your resume into a beautiful web presence or craft your story step-by-step.
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
          <motion.div
            className="bg-gray-800 bg-opacity-80 backdrop-blur-sm p-8 rounded-lg border border-gray-700 cursor-pointer hover:bg-opacity-100 transition-all duration-300 shadow-lg text-center transform hover:-translate-y-2" // Reverted card background to dark theme
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
          >
            <FaFileUpload className="text-5xl mx-auto mb-4 text-orange-400" /> {/* Reverted icon color */}
            <h3 className="text-2xl font-semibold mb-2 text-white">Upload Resume</h3> {/* Reverted heading color */}
            <p className="text-base text-gray-300"> {/* Reverted paragraph text color */}
              Let us extract your information from your resume automatically using AI.
            </p>
          </motion.div>

          <motion.div
            className="bg-gray-800 bg-opacity-80 backdrop-blur-sm p-8 rounded-lg border border-gray-700 cursor-pointer hover:bg-opacity-100 transition-all duration-300 shadow-lg text-center transform hover:-translate-y-2" // Reverted card background to dark theme
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/details')}
          >
            <FaKeyboard className="text-5xl mx-auto mb-4 text-blue-400" /> {/* Reverted icon color */}
            <h3 className="text-2xl font-semibold mb-2 text-white">Enter Details Manually</h3> {/* Reverted heading color */}
            <p className="text-base text-gray-300"> {/* Reverted paragraph text color */}
              Prefer a hands-on approach? Fill in your portfolio details step-by-step.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-lg p-8 w-full max-w-md text-gray-100 shadow-2xl border border-gray-700" // Reverted modal background to dark theme
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Upload Your Resume</h2> {/* Reverted gradient */}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="mb-6 w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600" // Reverted input styles
              />
              {uploadError && <p className="text-red-500 text-sm mb-4">{uploadError}</p>} {/* Reverted error color */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => { setShowModal(false); setSelectedFile(null); setUploadError(null); }}
                  className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors duration-200 font-semibold shadow-md" // Reverted button style
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadSubmit}
                  className={`px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors duration-200 font-semibold shadow-md ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload & Parse'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add a style block for the glow effect and grid background */}
      <style jsx>{`


        .grid-word-effect {
          position: relative;
          display: inline-block;
          padding: 0.1em 0.3em; /* Small padding around the word */
          overflow: hidden; /* Ensures pseudo-element doesn't spill out */
          color: #333; /* Dark text color for contrast against white grid */
          z-index: 1; /* Ensure text is above the pseudo-element */
        }

        .grid-word-effect::before {
          content: '';
          position: absolute;
          inset: 0; /* Cover the entire span */
          z-index: -1; /* Place behind the text */
          background-color: white; /* White background */
          background-image:
            linear-gradient(to right, rgba(0, 0, 0, 0.2) 1px, transparent 1px), /* Black lines, increased opacity */
            linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 1px, transparent 1px); /* Black lines, increased opacity */
          background-size: 20px 20px; /* Adjust grid cell size */
          animation: flowy-grid-word 10s linear infinite; /* Animation for the grid */
          opacity: 0.9; /* Make the grid more visible */
          border-radius: 5px; /* Optional: slightly rounded corners for the background */
        }

        @keyframes flowy-grid-word {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 20px 20px; /* Move by one grid cell size */
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
