import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null); // Will be { uid: '...' } or null
  const [loading, setLoading] = useState(true); // True until initial auth check is done

  useEffect(() => {
    // console.log("AuthContext: useEffect triggered. Current authToken state:", authToken);

    const verifyAuthToken = async () => {
      if (!authToken) {
        // console.log("AuthContext: No authToken present. Ensuring user is null.");
        setUser(null);
        setLoading(false); // No token, so auth check is complete
        return; // Exit early
      }

      // If authToken is present, try to verify it with the backend
      // console.log("AuthContext: authToken present. Attempting to verify and fetch user portfolio...");
      setLoading(true); // Always set loading true when starting verification

      try {
        const API_BASE_URL = 'https://grid-15d6.onrender.com';

        const res = await fetch(`${API_BASE_URL}/api/auth/myportfolio`, {
          headers: { "auth-token": authToken },
        });

        if (res.ok) { // Status 200-299, token is valid
          const portfolioData = await res.json();
          if (portfolioData && portfolioData.userId) {
            setUser({ uid: portfolioData.userId, hasPortfolio: true });
            // console.log("AuthContext: User portfolio fetched successfully. User UID:", portfolioData.userId);
          } else {
            // Token is valid (res.ok), but no specific portfolio data or userId was returned.
            // User is authenticated, but might need to create their portfolio.
            // Set user to indicate authenticated status without full portfolio data.
            // console.warn("AuthContext: Token valid, but no userId in portfolio data. Setting user as authenticated, no portfolio.");
            setUser({ uid: 'authenticated', hasPortfolio: false }); // 'authenticated' as a placeholder UID
          }
        } else if (res.status === 404) {
          // Token is valid, but no portfolio exists for the user.
          // The user IS authenticated, they just haven't created a portfolio yet.
          // console.log("AuthContext: User is authenticated, but no portfolio found (404). Setting user as authenticated, no portfolio.");
          setUser({ uid: 'authenticated', hasPortfolio: false }); // 'authenticated' as a placeholder UID
        } else {
          // Token is invalid, expired, or other server error (e.g., 401 Unauthorized, 403 Forbidden, 500 Internal)
          // console.error(`AuthContext: Failed to verify token. Status: ${res.status}`);
          localStorage.removeItem("token"); // Clear invalid/expired token
          setAuthToken(null); // This will re-trigger useEffect with null authToken
          setUser(null); // Clear user state
        }
      } catch (error) {
        // Network error, JSON parsing error, etc.
        console.error("AuthContext: Error during user portfolio fetch:", error);
        localStorage.removeItem("token"); // Clear token on network/parsing error
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false); // Authentication check is complete (whether success or failure)
        // console.log("AuthContext: verifyAuthToken finished. Loading set to false.");
      }
    };

    verifyAuthToken();
  }, [authToken]); // Dependency array: re-run whenever authToken state changes

  const login = (token) => {
    // console.log("AuthContext: login function called. Setting token.");
    localStorage.setItem("token", token);
    setAuthToken(token); // Update authToken state, triggering the useEffect above for verification
    // Immediately set a placeholder user state for quicker UI updates, it will be refined by useEffect
    setUser({ uid: 'authenticated', hasPortfolio: false });
  };

  const logout = () => {
    // console.log("AuthContext: logout function called. Clearing token and user.");
    localStorage.removeItem("token");
    setAuthToken(null); // Update authToken state, triggering useEffect
    setUser(null); // Clear user state immediately
  };

  // Provide authToken, user, login, logout, isAuthenticated (derived), and loading state
  const value = { authToken, user, login, logout, isAuthenticated: !!authToken, loading };

  return (
    <AuthContext.Provider value={value}>
      {/* IMPORTANT: Do NOT conditionally render children here based on `loading`.
          The `children` (your App's routes) should always be rendered.
          The `PrivateRoute` component in App.js is responsible for showing
          a loading spinner or redirecting based on the `loading` and `user` states. */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);