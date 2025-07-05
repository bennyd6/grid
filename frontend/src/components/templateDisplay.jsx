import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock Template Components - These are placeholders to resolve import errors.
// In a real application, these would be in their respective files.
const Template1 = () => <div className="p-4 text-center text-gray-700">Template 1 Content</div>;
const Template2 = () => <div className="p-4 text-center text-gray-700">Template 2 Content</div>;
const Template3 = () => <div className="p-4 text-center text-gray-700">Template 3 Content</div>;
const Template4 = () => <div className="p-4 text-center text-gray-700">Template 4 Content</div>;
const Template5 = () => <div className="p-4 text-center text-gray-700">Template 5 Content</div>;
const Template6 = () => <div className="p-4 text-center text-gray-700">Template 6 Content</div>;

// Mock Auth Context and Hook
const AuthContext = createContext(null);

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Initially not loading, user is logged out

  // Simulate login
  const login = () => {
    setLoading(true);
    setTimeout(() => {
      setUser({ uid: 'mock-user-id-123' });
      setLoading(false);
    }, 1000); // Simulate 1 second login time
  };

  // Simulate logout
  const logout = () => {
    setLoading(true);
    setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 500); // Simulate 0.5 second logout time
  };

  return { user, loading, login, logout };
};

// AuthProvider component (optional, but good practice if useAuth is more complex)
const AuthProvider = ({ children }) => {
    const auth = useAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};


// Custom Message Modal Component
const MessageModal = ({ show, title, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-sm text-gray-100 shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
          {title}
        </h2>
        <p className="mb-6 text-gray-300">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200 font-semibold shadow-md"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const TemplateDisplay = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, login, logout } = useAuth(); // Destructure login/logout from useAuth

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false); // State for custom message modal
  const [messageModalContent, setMessageModalContent] = useState({ title: '', message: '' }); // Content for message modal

  // Array to map through for rendering templates
  const templates = [
    { id: 1, name: 'Modern & Clean', component: Template1, buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300' },
    { id: 2, name: 'Minimalist & Professional', component: Template2, buttonColor: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300' },
    { id: 3, name: 'Clean & Structured', component: Template3, buttonColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-300' },
    { id: 4, name: 'Dark & Dynamic', component: Template4, buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-300' },
    { id: 5, 'name': 'Minimalist B&W', component: Template5, buttonColor: 'bg-gray-800 hover:bg-gray-900 focus:ring-gray-400' },
    { id: 6, name: 'Classy Gradients', component: Template6, buttonColor: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-300' },
  ];

  const handleHostTemplate = async (templateId) => {
    // Debugging logs
    console.log('handleHostTemplate called.');
    console.log('authLoading:', authLoading);
    console.log('user:', user);
    console.log('user.uid:', user ? user.uid : 'N/A');

    if (authLoading) {
      setMessageModalContent({
        title: "Authentication Status",
        message: "Please wait while we verify your login status."
      });
      setShowMessageModal(true);
      return;
    }

    if (!user || !user.uid) {
      setMessageModalContent({
        title: "Login Required",
        message: "You must be logged in to host your portfolio. Please log in."
      });
      setShowMessageModal(true);
      return;
    }

    const publicUrl = `${window.location.origin}/public-template/${templateId}/${user.uid}`;
    setShareUrl(publicUrl);
    setShowShareModal(true); // Show the custom share modal

    try {
      // Use document.execCommand('copy') for better compatibility in iframes
      const textarea = document.createElement('textarea');
      textarea.value = publicUrl;
      textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in iOS.
      textarea.style.opacity = '0'; // Hide the textarea
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
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

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({ title: '', message: '' });
  };

  return (
    // Wrap the main component with AuthProvider if you want to use context
    // For this self-contained example, useAuth is directly in the file.
    // If you had a separate App.js, you'd wrap the <TemplateDisplay> there.
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
            {/* Action Buttons */}
            <div className="flex justify-center items-center gap-4 mt-8">
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

                {/* Login/Logout Button */}
                {!user ? (
                    <button
                        onClick={login}
                        disabled={authLoading}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg
                                    hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {authLoading ? 'Logging In...' : 'Login to Host'}
                    </button>
                ) : (
                    <button
                        onClick={logout}
                        disabled={authLoading}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg
                                    hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {authLoading ? 'Logging Out...' : 'Logout'}
                    </button>
                )}
            </div>
            {user && <p className="mt-4 text-sm text-gray-400">Logged in as: {user.uid}</p>}
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
                <div className="p-6 bg-gray-100 border-t border-gray-200 flex justify-center flex-wrap gap-3"> {/* Added flex-wrap and gap */}
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
                onClick={() => {
                  const textarea = document.createElement('textarea');
                  textarea.value = shareUrl;
                  textarea.style.position = 'fixed';
                  textarea.style.opacity = '0';
                  document.body.appendChild(textarea);
                  textarea.focus();
                  textarea.select();
                  document.execCommand('copy');
                  document.body.removeChild(textarea);
                  setCopySuccess('Copied!');
                }}
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

      {/* Custom Message Modal */}
      <MessageModal
        show={showMessageModal}
        title={messageModalContent.title}
        message={messageModalContent.message}
        onClose={closeMessageModal}
      />
    </div>
  );
};

export default TemplateDisplay;
