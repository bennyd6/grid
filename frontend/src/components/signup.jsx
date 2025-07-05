import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="bg-black text-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-black text-white placeholder-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading} 
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-black text-white placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-black text-white placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded-md hover:bg-gray-200 transition relative"
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
        <p className="mt-4 text-center text-sm">
          Already have an account? <a href="/login" className="text-white font-medium">Login</a>
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
              <h3 className="text-xl font-bold mb-4 text-center">
                {modalType === 'success' ? 'Success!' : 'Error!'}
              </h3>
              <p className="text-center mb-6">{modalMessage}</p>
              {modalType === 'error' && ( // Only show "OK" button for error messages
                <div className="flex justify-center">
                  <button
                    onClick={closeModal}
                    className={`px-6 py-2 rounded-full font-semibold shadow-md transition-colors duration-200 ${modalType === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
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