import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Template1 from '../templates/template1';
import Template2 from '../templates/template2';
import Template3 from '../templates/template3';
import Template4 from '../templates/template4';
import Template5 from '../templates/template5';
import Template6 from '../templates/template6';
import { useAuth } from '../context/authContext';

const TemplateDisplay = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, authToken } = useAuth(); // Get authToken here too

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState("");
  const [resolvedUserId, setResolvedUserId] = useState(null); // State to hold resolved user ID

  const templates = [
    { id: 1, name: 'Modern & Clean', component: Template1, buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300' },
    { id: 2, name: 'Minimalist & Professional', component: Template2, buttonColor: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300' },
    { id: 3, name: 'Clean & Structured', component: Template3, buttonColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-300' },
    { id: 4, name: 'Dark & Dynamic', component: Template4, buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-300' },
    { id: 5, name: 'Minimalist B&W', component: Template5, buttonColor: 'bg-gray-800 hover:bg-gray-900 focus:ring-gray-400' },
    { id: 6, name: 'Classy Gradients', component: Template6, buttonColor: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-300' },
  ];

  // Effect to resolve user ID if not provided by AuthContext
  useEffect(() => {
    // console.log("TemplateDisplay - useEffect: user:", user, "authLoading:", authLoading, "authToken:", authToken);
    if (!authLoading && authToken && (!user || !user.uid)) {
      // User is authenticated (has a token) but AuthContext didn't provide a user.uid.
      // This implies either no portfolio data or backend didn't return userId.
      // We need to fetch the userId.
      const fetchUserId = async () => {
        try {
          // This assumes you have an endpoint that just returns the authenticated user's ID
          // For example, an endpoint like /api/auth/me or /api/auth/userId
          // You might need to create this endpoint on your backend if it doesn't exist.
          const API_BASE_URL = 'https://grid-15d6.onrender.com'; // Use your actual API base URL

          const res = await fetch(`${API_BASE_URL}/api/auth/me`, { // <-- Assuming a /me endpoint that returns user info including ID
            headers: { "auth-token": authToken },
          });

          if (res.ok) {
            const data = await res.json();
            if (data && data.userId) { // Assuming the response has a userId field
              setResolvedUserId(data.userId);
              console.log("TemplateDisplay: Successfully resolved user ID from /me endpoint:", data.userId);
            } else {
              console.warn("TemplateDisplay: /me endpoint did not return userId.");
              setResolvedUserId(null); // Ensure it's cleared if not found
            }
          } else {
            console.error("TemplateDisplay: Failed to fetch user ID from /me endpoint, status:", res.status);
            setResolvedUserId(null); // Clear ID on failure
          }
        } catch (error) {
          console.error("TemplateDisplay: Error fetching user ID:", error);
          setResolvedUserId(null); // Clear ID on error
        }
      };
      fetchUserId();
    } else if (user && user.uid) {
      // If AuthContext already provided the user.uid, use that
      setResolvedUserId(user.uid);
    } else if (!authToken) {
      // If there's no token, ensure resolvedUserId is null
      setResolvedUserId(null);
    }
  }, [user, authLoading, authToken]); // Re-run if user, loading, or token changes

  const handleHostTemplate = async (templateId) => {
    console.log('handleHostTemplate called.');
    console.log('authLoading:', authLoading);
    console.log('user:', user);
    console.log('resolvedUserId:', resolvedUserId); // Use the resolved ID

    if (authLoading) {
      setAuthModalMessage("Verifying your login status. Please wait a moment...");
      setShowAuthRequiredModal(true);
      return;
    }
    
    // Check if user is not authenticated (no token) OR if we couldn't resolve a user ID
    if (!authToken || !resolvedUserId) {
      setAuthModalMessage("You must be logged in to host your portfolio. Please log in or create an account.");
      setShowAuthRequiredModal(true);
      return;
    }

    // Now, check if the portfolio details are filled (user.hasPortfolio property from AuthContext)
    // IMPORTANT: Your current AuthContext does NOT set a `hasPortfolio` flag.
    // It only sets `user` to `{ uid: portfolioData.userId }` if portfolio exists and has userId.
    // If portfolio is missing or has no userId, user becomes `null`.
    // So, if `user` is NOT null here, it implies `portfolioData.userId` was found.
    if (!user || !user.uid) { // This means `user` was `null` from AuthContext, implying no portfolio details or userId in portfolio data
        setAuthModalMessage("To host a template, you need to complete your profile details first. Please go to 'Edit Your Details' to set up your portfolio.");
        setShowAuthRequiredModal(true);
        return;
    }


    // If we reach here, authToken exists, resolvedUserId exists, and user object implies portfolio details were found.
    const publicUrl = `${window.location.origin}/public-template/${templateId}/${resolvedUserId}`;
    setShareUrl(publicUrl);
    setShowShareModal(true);

    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopySuccess('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
      setCopySuccess('Failed to copy. Please copy manually.');
    }
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setShareUrl('');
    setCopySuccess('');
  };

  const closeAuthRequiredModal = () => {
    setShowAuthRequiredModal(false);
    setAuthModalMessage("");
  };

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/bg-1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to make text readable over video */}
      <div className="absolute inset-0 bg-black opacity-60 z-10"></div>

      <div className="relative z-20 min-h-screen p-6 md:p-10 font-inter text-gray-100">
        <div className="max-w-7xl mx-auto relative">
          {/* Header Section */}
          <div className="text-center py-16 mb-12">
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-6 drop-shadow-lg">
              Craft Your Digital Identity
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Select a stunning portfolio template that best represents your unique style and professional journey.
            </p>
            {/* Edit Details Button */}
            <button
              onClick={() => navigate('/details')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-700 text-gray-100 font-semibold rounded-full shadow-lg
                         hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM10 12.586L17.586 5 15 2.414 7.414 10 10 12.586zM15 17a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              <span>Edit Your Details</span>
            </button>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-200 transform hover:-translate-y-2"
              >
                <h2 className="text-2xl font-bold text-center text-gray-800 p-6 bg-gray-100 border-b border-gray-200">
                  Template {template.id}: {template.name}
                </h2>
                <div className="p-6 flex-grow flex items-center justify-center bg-gray-50">
                  {/* Inner div for scaling and scrolling */}
                  <div className="w-[480px] h-[280px] border border-gray-300 rounded-lg shadow-inner bg-white
                                  origin-top overflow-y-auto"> {/* This is the scrollable preview frame */}
                    {/* This div contains the actual template, rendered at a larger size and then scaled down */}
                    {/* Assuming a base template width of 1280px and a height that can be very long (e.g., 2000px for multiple sections) */}
                    <div style={{ width: '1280px', height: '2000px', transform: 'scale(0.375)', transformOrigin: 'top left' }}>
                      <template.component />
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-100 border-t border-gray-200 flex justify-center flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/template/${template.id}`)}
                    className={`${template.buttonColor} text-white font-semibold py-3 px-6 rounded-full shadow-lg
                                transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 text-sm`}
                  >
                    View Full Template
                  </button>
                  <button
                    onClick={() => handleHostTemplate(template.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg
                                transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 text-sm"
                  >
                    Host This Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shareable Link Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md text-gray-100 shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
              Your Public Portfolio Link
            </h2>
            <p className="mb-4 text-gray-300">
              Share this link with anyone to showcase your portfolio. It will always display your latest saved details.
            </p>
            <div className="relative mb-4">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full p-3 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none"
              />
              <button
                onClick={() => navigator.clipboard.writeText(shareUrl).then(() => setCopySuccess('Copied!'))}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors"
                title="Copy to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-200" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H6zM10 9a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-4 4a1 1 0 011-1h2a1 1 0 110 2H7a1 1 0 01-1-1z" />
                </svg>
              </button>
            </div>
            {copySuccess && <p className="text-green-400 text-sm mb-4 text-center">{copySuccess}</p>}
            <div className="flex justify-end">
              <button
                onClick={closeShareModal}
                className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200 font-semibold shadow-md"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Auth Required Modal */}
      {showAuthRequiredModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md text-gray-100 shadow-2xl border border-gray-700 text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-400">
              Action Required!
            </h2>
            <p className="mb-6 text-gray-300">
              {/* Dynamic message based on auth state and portfolio status */}
              {authLoading ?
                "Verifying your login status. Please wait a moment..." :
                (!authToken || !resolvedUserId ? // Check if authenticated or if ID could be resolved
                  "Try refreshing the page..." :
                  "To host a template, you need to complete your profile details first. Please go to 'Edit Your Details' to set up your portfolio."
                )
              }
            </p>
            <button
              onClick={closeAuthRequiredModal}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md"
            >
              Okay
            </button>
            {/* Show "Go to Details" only if token exists but no portfolio data */}
            {authToken && !user && ( // `user` being null here implies no portfolio data (or userId from portfolio data)
                <button
                    onClick={() => { closeAuthRequiredModal(); navigate('/details'); }}
                    className="ml-4 px-6 py-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors duration-200 font-semibold shadow-md"
                >
                    Go to Details
                </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateDisplay;