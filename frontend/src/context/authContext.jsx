import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null); // Stores user object (e.g., { uid: '...' })
  const [loading, setLoading] = useState(true); // True initially, becomes false after auth check

  useEffect(() => {
    // ... (console logs)

    const verifyAuthToken = async () => {
      if (authToken) {
        // ... (console logs)
        setLoading(true); // Set loading true when starting verification
        try {
          const API_BASE_URL = 'https://grid-15d6.onrender.com' || 'http://localhost:3000';
          // ... (console logs)

          const res = await fetch(`${API_BASE_URL}/api/auth/myportfolio`, {
            headers: { "auth-token": authToken },
          });

          if (res.ok) { // Status 200-299
            const portfolioData = await res.json();
            if (portfolioData && portfolioData.userId) { // <-- THIS IS THE CRITICAL LINE
              setUser({ uid: portfolioData.userId }); // ONLY sets user if userId is present in response
              console.log("AuthContext: User portfolio fetched successfully. User UID:", portfolioData.userId);
            } else {
              // This block runs if res.ok but portfolioData or portfolioData.userId is missing
              console.warn("AuthContext: Portfolio data fetched but no userId found or invalid structure. Clearing user, keeping token.");
              setUser(null); // <-- user is set to null here!
            }
          } else if (res.status === 404) { // <-- THIS IS THE OTHER CRITICAL LINE
            console.log("AuthContext: User is authenticated, but no portfolio found (404). Keeping token, setting user to null.");
            // This explicitly states "setting user to null."
            // setUser(null); // This commented line implies you might have tried to set it to null or had it this way before.
            // If this line is commented out, then if res.status === 404, user remains whatever it was before, or null if initialized as such.
            // If user was previously null, it stays null.
            // THIS IS THE ROOT CAUSE: If `myportfolio` returns 404, `user` remains `null`.
          }
          // The commented-out else block for other errors also sets user to null and clears token.
          // ...
        } catch (error) {
          // ... (error handling, sets user to null)
        } finally {
          setLoading(false); // Always set loading to false
        }
      } else {
        // No authToken present
        setUser(null);
        setLoading(false);
      }
    };

    verifyAuthToken();
  }, [authToken]);

  const login = (token) => {
    // ... (sets authToken, which triggers useEffect)
  };

  const logout = () => {
    // ... (clears token, sets authToken to null, sets user to null)
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout, isAuthenticated: !!authToken, loading }}>
      {/* Children are rendered only when auth loading is complete */}
      {!loading && children} 
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 text-white text-xl z-50">
          Verifying session...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);