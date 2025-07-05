import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode

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

      let decodedUid = null;
      try {
        const decoded = jwtDecode(authToken);
        // Assuming your JWT has a 'userId' or 'id' claim for the user ID
        // Adjust 'userId' if your token uses a different claim name (e.g., 'id', 'sub')
        decodedUid = decoded.userId || decoded.id || decoded.sub;
        if (!decodedUid) {
          console.error("AuthContext: Decoded token does not contain a userId/id/sub claim.");
          // If token doesn't contain UID, treat as invalid for this purpose
          localStorage.removeItem("token");
          setAuthToken(null);
          setUser(null);
          setLoading(false);
          return;
        }
        // console.log("AuthContext: Decoded UID from token:", decodedUid);
      } catch (decodeError) {
        console.error("AuthContext: Failed to decode JWT token:", decodeError);
        localStorage.removeItem("token"); // Clear invalid token
        setAuthToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

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
            // Use the UID obtained from decoding the token.
            // console.warn("AuthContext: Token valid, but no userId in portfolio data. Setting user as authenticated with decoded UID, no portfolio.");
            setUser({ uid: decodedUid, hasPortfolio: false });
          }
        } else if (res.status === 404) {
          // Token is valid, but no portfolio exists for the user.
          // Use the UID obtained from decoding the token.
          // console.log("AuthContext: User is authenticated, but no portfolio found (404). Setting user with decoded UID, no portfolio.");
          setUser({ uid: decodedUid, hasPortfolio: false });
        } else {
          // Token is invalid, expired, or other server error (e.g., 401 Unauthorized, 403 Forbidden, 500 Internal)
          // console.error(`AuthContext: Failed to verify token. Status: ${res.status}`);
          localStorage.removeItem("token"); // Clear invalid/expired token
          setAuthToken(null);
          setUser(null);
        }
      } catch (error) {
        // Network error, JSON parsing error, etc.
        console.error("AuthContext: Error during user portfolio fetch:", error);
        localStorage.removeItem("token"); // Clear token on network/parsing error
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false); // Authentication check is complete
        // console.log("AuthContext: verifyAuthToken finished. Loading set to false.");
      }
    };

    verifyAuthToken();
  }, [authToken]); // Dependency array: re-run whenever authToken state changes

  const login = (token) => {
    // console.log("AuthContext: login function called. Setting token.");
    localStorage.setItem("token", token);
    setAuthToken(token); // Update authToken state, triggering the useEffect above for verification

    // Immediately set a placeholder user state with the decoded UID for quicker UI updates
    // This ensures components like TemplateDisplay have the correct UID right away.
    let tempUid = null;
    try {
      const decoded = jwtDecode(token);
      tempUid = decoded.userId || decoded.id || decoded.sub;
    } catch (e) {
      console.error("AuthContext: Failed to decode token on login:", e);
    }
    setUser({ uid: tempUid, hasPortfolio: false }); // hasPortfolio will be updated by useEffect
  };

  const logout = () => {
    // console.log("AuthContext: logout function called. Clearing token and user.");
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null); // Clear user state immediately
  };

  const value = { authToken, user, login, logout, isAuthenticated: !!authToken, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);