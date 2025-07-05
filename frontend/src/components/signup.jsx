import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const { login } = useAuth();
  const navigate = useNavigate();

  // State for custom modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success"); // 'success' or 'error'
  // New state for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await fetch("https://grid-15d6.onrender.com/api/auth/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const json = await response.json();

      if (response.ok && json.authtoken) {
        login(json.authtoken);
        setModalMessage("Signup successful! Redirecting to home...");
        setModalType("success");
        setShowModal(true);
        // Redirect after a short delay, allowing the success message to be seen
        setTimeout(() => {
          navigate("/");
          window.location.reload();
          // setIsLoading(false); // No need to set false here as component will unmount
        }, 1500);
      } else {
        setIsLoading(false); // Stop loading on error
        setModalMessage(json.error || "Signup failed. Please try again.");
        setModalType("error");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setIsLoading(false); // Stop loading on error
      setModalMessage("Something went wrong. Please check your network connection.");
      setModalType("error");
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
    // If it was a success modal leading to redirect, prevent closing if redirect hasn't happened
    // This is handled by the setTimeout already, but useful if you had different logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4"> {/* Changed background to a slightly softer dark */}
      <div className="bg-black text-white rounded-lg shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 ease-in-out hover:scale-105"> {/* Enhanced shadow and hover effect */}
        <h2 className="text-4xl font-extrabold mb-6 text-center text-white animate-fade-in-down"> {/* Larger, bolder title with animation */}
          Join Us!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased spacing */}
          <div>
            <label htmlFor="name" className="block mb-2 font-semibold text-gray-300">Your Name</label> {/* Descriptive label */}
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-3 focus:ring-white focus:border-transparent bg-gray-800 text-white placeholder-gray-400 transition duration-300 ease-in-out" // Improved focus styles and transition
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-300">Email Address</label> {/* Descriptive label */}
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-3 focus:ring-white focus:border-transparent bg-gray-800 text-white placeholder-gray-400 transition duration-300 ease-in-out" // Improved focus styles and transition
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          <div className="relative"> {/* Added relative positioning for the show/hide button */}
            <label htmlFor="password" className="block mb-2 font-semibold text-gray-300">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-3 focus:ring-white focus:border-transparent bg-gray-800 text-white placeholder-gray-400 transition duration-300 ease-in-out" // Improved focus styles and transition
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-8 text-gray-500 hover:text-white focus:outline-none transition duration-150 ease-in-out"
              disabled={isLoading}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414L5.586 7H3a1 1 0 000 2h3.586l-2.293 2.293a1 1 0 101.414 1.414L8 10.414l2.293 2.293a1 1 0 001.414-1.414L9.414 9l2.293-2.293a1 1 0 00-1.414-1.414L8 7.586l-2.293-2.293a1 1 0 00-1.414 0zM14.707 5.293a1 1 0 00-1.414 1.414L15.586 9H13a1 1 0 000 2h2.586l-2.293 2.293a1 1 0 001.414 1.414L18 10.414l-2.293-2.293a1 1 0 00-1.414 0z" clipRule="evenodd" />
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="cursor-pointer w-full bg-white text-black py-3 rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 flex items-center justify-center relative" // Enhanced button with animations and flex for loader
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing Up...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-base text-gray-300">
          Already have an account? <a href="/login" className="text-white font-semibold hover:underline transition duration-200">Login here</a> {/* Improved link styling */}
        </p>
      </div>

      {/* Custom Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`rounded-lg p-8 w-full max-w-sm shadow-2xl border ${modalType === 'success' ? 'bg-green-800 border-green-700 text-white' : 'bg-red-800 border-red-700 text-white'}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-center">
                {modalType === 'success' ? 'Success!' : 'Error!'}
              </h3>
              <p className="text-center mb-6 text-lg">{modalMessage}</p> {/* Larger text for message */}
              {modalType === 'error' && ( // Only show "OK" button for error messages
                <div className="flex justify-center">
                  <button
                    onClick={closeModal}
                    className={`px-8 py-3 rounded-full font-bold shadow-lg transition-colors duration-200 ${modalType === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
                  >
                    OK
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Signup;