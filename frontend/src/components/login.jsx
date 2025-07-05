import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://grid-15d6.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();
    if (json.authtoken) {
      login(json.authtoken);
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4"> {/* Changed background to a slightly softer dark */}
      <div className="bg-white text-gray-900 rounded-lg shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 ease-in-out hover:scale-105"> {/* Enhanced shadow and hover effect */}
        <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-900 animate-fade-in-down"> {/* Larger, bolder title with animation */}
          Welcome Back!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased spacing */}
          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">Email Address</label> {/* Slightly more descriptive label */}
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-black focus:border-transparent transition duration-300 ease-in-out" // Improved focus styles and transition
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="relative"> {/* Added relative positioning for the show/hide button */}
            <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-black focus:border-transparent transition duration-300 ease-in-out" // Improved focus styles and transition
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-8 text-gray-600 hover:text-gray-900 focus:outline-none transition duration-150 ease-in-out"
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
            className="cursor-pointer w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50" // Enhanced button with animations
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-base text-gray-700">
          Don't have an account? <a href="/signup" className="text-black font-semibold hover:underline transition duration-200">Sign up here</a> {/* Improved link styling */}
        </p>
      </div>
    </div>
  );
};

export default Login;