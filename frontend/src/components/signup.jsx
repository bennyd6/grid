import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { motion, AnimatePresence } from "framer-motion";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const API_BASE_URL = 'https://grid-15d6.onrender.com';

      const response = await fetch(`${API_BASE_URL}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const json = await response.json();

      if (response.ok && json.authtoken) {
        login(json.authtoken);
        setModalMessage("Signup successful! Redirecting to your dashboard...");
        setModalType("success");
        setShowModal(true);

        setTimeout(() => {
          window.location.reload(); // Perform a hard reload to ensure context re-initializes
        }, 1500);

      } else {
        setIsLoading(false);
        setModalMessage(json.error || "Signup failed. Please try again.");
        setModalType("error");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setIsLoading(false);
      setModalMessage("Something went wrong. Please check your network connection or try again.");
      setModalType("error");
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4"> {/* bg-black for dominant theme */}
      <div className="bg-gray-900 rounded-lg shadow-2xl p-8 w-full max-w-md border border-gray-700"> {/* Darker background for form */}
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">Create Your Account</h2> {/* Blue accent */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-300">Your Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white placeholder-gray-500" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-300">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white placeholder-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2.5 rounded-md hover:bg-blue-800 transition duration-300 ease-in-out relative font-semibold shadow-md
                       flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:text-blue-400 font-medium transition duration-200"> {/* Blue link */}
            Login here
          </a>
        </p>
      </div>

      {/* Custom Modal for success/error messages - unchanged as they are already themed well */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`rounded-lg p-8 w-full max-w-sm shadow-2xl border ${
                modalType === "success"
                  ? "bg-green-800 border-green-700 text-white"
                  : "bg-red-800 border-red-700 text-white"
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-xl font-bold mb-4 text-center">
                {modalType === "success" ? "Success!" : "Error!"}
              </h3>
              <p className="text-center mb-6">{modalMessage}</p>
              {modalType === "error" && (
                <div className="flex justify-center">
                  <button
                    onClick={closeModal}
                    className={`px-6 py-2 rounded-full font-semibold shadow-md transition-colors duration-200 ${
                      modalType === "success"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white`}
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