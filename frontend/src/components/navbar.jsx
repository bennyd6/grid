import React, { useState } from 'react'; // Import useState
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Assuming your AuthContext is here

const Navbar = () => {
  const { logout } = useAuth(); // Get logout function from AuthContext
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to manage mobile menu visibility

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
    setIsMobileMenuOpen(false); // Close mobile menu on logout
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/" className="text-2xl font-bold grid-logo-effect"> {/* Added grid-logo-effect class */}
          grid.
        </Link>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-yellow-400 transition-colors duration-300">Home</Link>
          <Link to="/details" className="hover:text-yellow-400 transition-colors duration-300">Details</Link>
          <Link to="/templates" className="hover:text-yellow-400 transition-colors duration-300">Templates</Link>
        </div>

        {/* Logout Button (Desktop) */}
        <div className="hidden md:block">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-300 font-semibold"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button (Hamburger Icon) */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (Conditionally rendered) */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-2 bg-gray-800 rounded-b-lg py-2">
          <Link to="/" className="block px-4 py-2 hover:bg-gray-700 transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/details" className="block px-4 py-2 hover:bg-gray-700 transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>Details</Link>
          <Link to="/templates" className="block px-4 py-2 hover:bg-gray-700 transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>Templates</Link>
          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors duration-300">Logout</button>
        </div>
      )}

      {/* Style block for the grid effect on the logo */}
      <style jsx>{`
        .grid-logo-effect {
          position: relative;
          display: inline-block;
          padding: 0.1em 0.2em; /* Small padding around the word */
          overflow: hidden; /* Ensures pseudo-element doesn't spill out */
          color: #333; /* Dark text color for contrast against white grid */
          z-index: 1; /* Ensure text is above the pseudo-element */
          /* Remove bg-clip-text and gradients from here, as ::before will handle background */
          background: none;
          -webkit-background-clip: unset;
          -webkit-text-fill-color: unset;
        }

        .grid-logo-effect::before {
          content: '';
          position: absolute;
          inset: 0; /* Cover the entire span */
          z-index: -1; /* Place behind the text */
          background-color: white; /* White background */
          background-image:
            linear-gradient(to right, rgba(0, 0, 0, 0.2) 1px, transparent 1px), /* Black lines, increased opacity */
            linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 1px, transparent 1px); /* Black lines, increased opacity */
          background-size: 15px 15px; /* Adjust grid cell size for logo */
          animation: flowy-grid-logo 8s linear infinite; /* Animation for the grid */
          opacity: 0.9; /* Make the grid more visible */
          border-radius: 3px; /* Optional: slightly rounded corners for the background */
        }

        @keyframes flowy-grid-logo {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 15px 15px; /* Move by one grid cell size */
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
