import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null); // Stores user object (e.g., { uid: '...' })
  const [loading, setLoading] = useState(true); // True initially, becomes false after auth check

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("AuthContext: initializeAuth started.");
      const tokenFromStorage = localStorage.getItem("token");

      // Only update authToken state if it's different to prevent unnecessary re-renders
      if (authToken !== tokenFromStorage) {
        setAuthToken(tokenFromStorage);
      }

      if (tokenFromStorage) {
        console.log("AuthContext: Token found in localStorage. Attempting to fetch user portfolio...");
        try {
          // Use environment variable for API_BASE_URL
          const API_BASE_URL = 'https://grid-15d6.onrender.com' || 'http://localhost:3000';
          console.log(`AuthContext: Fetching from ${API_BASE_URL}/api/auth/myportfolio`);

          const res = await fetch(`${API_BASE_URL}/api/auth/myportfolio`, {
            headers: { "auth-token": tokenFromStorage },
          });

          if (res.ok) {
            const portfolioData = await res.json();
            if (portfolioData && portfolioData.userId) {
              setUser({ uid: portfolioData.userId });
              console.log("AuthContext: User portfolio fetched successfully. User UID:", portfolioData.userId);
            } else {
              console.warn("AuthContext: Portfolio data fetched but no userId found or invalid structure. Clearing token.");
              localStorage.removeItem("token");
              setAuthToken(null);
              setUser(null);
            }
          } else {
            // If fetching portfolio fails (e.g., 401 Unauthorized, 500 Internal Server Error)
            let errorDetails = await res.text(); // Read as text to avoid JSON parsing errors for non-JSON responses
            console.error(`AuthContext: Failed to fetch user portfolio. Status: ${res.status}. Response: ${errorDetails}`);
            console.warn("AuthContext: Invalid token or backend issue. Clearing token.");
            localStorage.removeItem("token"); // Clear invalid/expired token
            setAuthToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error("AuthContext: Error during user portfolio fetch:", error);
          console.warn("AuthContext: Network error or unexpected response. Clearing token.");
          localStorage.removeItem("token"); // Clear token on network error or parsing error
          setAuthToken(null);
          setUser(null);
        }
      } else {
        console.log("AuthContext: No token found in localStorage.");
        setUser(null); // Ensure user is null if no token
      }
      setLoading(false); // Authentication check is complete
      console.log("AuthContext: initializeAuth finished. Loading set to false.");
    };

    // This useEffect now depends on authToken.
    // It will run on mount, and whenever authToken state changes.
    // This is crucial for reacting to `login` and `logout` calls.
    initializeAuth();
  }, [authToken]); // Dependency array includes authToken

  const login = (token) => {
    console.log("AuthContext: login function called with token.");
    localStorage.setItem("token", token);
    // Set authToken state. This will trigger the useEffect above to re-initialize auth.
    setAuthToken(token);
  };

  const logout = () => {
    console.log("AuthContext: logout function called. Clearing token and user.");
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout, isAuthenticated: !!user, loading }}>
      {/* Children are rendered only when auth loading is complete */}
      {!loading && children}
      {loading && (
        // Optional: Add a loading spinner or message while authentication is being checked
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 text-white text-xl z-50">
          Verifying session...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
