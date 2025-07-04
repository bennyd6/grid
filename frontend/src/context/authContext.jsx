import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null); // Start as null, will be set by initializeAuth or login
  const [user, setUser] = useState(null); // Stores user object (e.g., { uid: '...' })
  const [loading, setLoading] = useState(true); // True initially, becomes false after auth check

  // Memoize initializeAuth to prevent unnecessary re-creations and ensure consistent behavior
  const initializeAuth = useCallback(async () => {
    console.log("AuthContext: initializeAuth started.");
    const tokenFromStorage = localStorage.getItem("token");

    if (tokenFromStorage) {
      console.log("AuthContext: Token found in localStorage. Attempting to fetch user portfolio...");
      setAuthToken(tokenFromStorage); // Ensure authToken state is set from storage
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
      setAuthToken(null); // Ensure authToken is null if no token
      setUser(null); // Ensure user is null if no token
    }
    setLoading(false); // Authentication check is complete
    console.log("AuthContext: initializeAuth finished. Loading set to false.");
  }, []); // Empty dependency array for initializeAuth: runs once on mount

  // Run initializeAuth only once on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]); // Dependency on memoized initializeAuth

  const login = useCallback((token) => {
    console.log("AuthContext: login function called with token. Setting to localStorage.");
    localStorage.setItem("token", token);
    // After setting the token, re-run the full authentication check
    // by explicitly calling initializeAuth.
    initializeAuth();
  }, [initializeAuth]); // Dependency on memoized initializeAuth

  const logout = useCallback(() => {
    console.log("AuthContext: logout function called. Clearing token and user.");
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
    // No need to call initializeAuth here, as the states are directly cleared.
  }, []);

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
