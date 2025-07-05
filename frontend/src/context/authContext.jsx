import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize authToken state directly from localStorage on initial render
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null); // Stores user object (e.g., { uid: '...' })
  const [loading, setLoading] = useState(true); // True initially, becomes false after auth check

  useEffect(() => {
    console.log("AuthContext: useEffect triggered. Current authToken state:", authToken);

    const verifyAuthToken = async () => {
      if (authToken) {
        console.log("AuthContext: authToken present. Attempting to fetch user portfolio...");
        setLoading(true); // Set loading true when starting verification
        try {
          // Use environment variable for API_BASE_URL
          const API_BASE_URL = 'https://grid-15d6.onrender.com' || 'http://localhost:3000';
          console.log(`AuthContext: Fetching from ${API_BASE_URL}/api/auth/myportfolio`);

          const res = await fetch(`${API_BASE_URL}/api/auth/myportfolio`, {
            headers: { "auth-token": authToken },
          });

          if (res.ok) {
            const portfolioData = await res.json();
            if (portfolioData && portfolioData.userId) {
              setUser({ uid: portfolioData.userId });
              console.log("AuthContext: User portfolio fetched successfully. User UID:", portfolioData.userId);
            } else {
              console.warn("AuthContext: Portfolio data fetched but no userId found or invalid structure. Clearing user, keeping token.");
              // Keep token, but user is not fully set if portfolio data is incomplete
              setUser(null);
            }
          } else if (res.status === 404) {
            console.log("AuthContext: User is authenticated, but no portfolio found (404). Keeping token, setting user to null.");
            // This is the key change: Don't clear the token if portfolio is not found.
            // User is authenticated, just needs to create a portfolio.
            // setUser(null);
          }
          // else {
          //   // If fetching portfolio fails for reasons other than 404 (e.g., 401 Unauthorized, 500 Internal Server Error)
          //   let errorDetails = await res.text(); // Read as text to avoid JSON parsing errors for non-JSON responses
          //   console.error(`AuthContext: Failed to fetch user portfolio. Status: ${res.status}. Response: ${errorDetails}`);
          //   console.warn("AuthContext: Invalid token or severe backend issue. Clearing token.");
          //   localStorage.removeItem("token"); // Clear invalid/expired token
          //   setAuthToken(null); // This will re-trigger useEffect with null authToken
          //   setUser(null);
          // }
        } catch (error) {
          console.error("AuthContext: Error during user portfolio fetch:", error);
          console.warn("AuthContext: Network error or unexpected response. Clearing token.");
          localStorage.removeItem("token"); // Clear token on network error or parsing error
          setAuthToken(null); // This will re-trigger useEffect with null authToken
          setUser(null);
        } finally {
          setLoading(false); // Always set loading to false after the fetch attempt
          console.log("AuthContext: verifyAuthToken finished. Loading set to false.");
        }
      } else {
        console.log("AuthContext: No authToken present in state. Ensuring user is null.");
        setUser(null); // Ensure user is null if no token
        setLoading(false); // No token, so loading is complete
        console.log("AuthContext: Loading set to false (no token).");
      }
    };

    verifyAuthToken();
  }, [authToken]); // Dependency array: re-run whenever authToken state changes

  const login = (token) => {
    console.log("AuthContext: login function called with token. Setting to localStorage and state.");
    localStorage.setItem("token", token);
    setAuthToken(token); // Update authToken state, which triggers the useEffect above
  };

  const logout = () => {
    console.log("AuthContext: logout function called. Clearing token and user.");
    localStorage.removeItem("token");
    setAuthToken(null); // Update authToken state, which triggers the useEffect above
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout, isAuthenticated: !!authToken, loading }}> {/* Changed isAuthenticated to !!authToken */}
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
