import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null); // New state to store user object (e.g., { uid: '...' })
  const [loading, setLoading] = useState(true); // True initially, becomes false after auth check

  useEffect(() => {
    const initializeAuth = async () => {
      if (authToken) {
        try {
          // Fetch user's portfolio to get their userId (uid)
          const res = await fetch("https://grid-15d6.onrender.com/api/auth/myportfolio", {
            headers: { "auth-token": authToken },
          });

          if (res.ok) {
            const portfolioData = await res.json();
            // Assuming portfolioData contains a 'userId' field that is the user's UID
            if (portfolioData && portfolioData.userId) {
              setUser({ uid: portfolioData.userId });
            } else {
              console.warn("Portfolio data fetched but no userId found. User might not be fully set.");
              localStorage.removeItem("token"); // Clear invalid token
              setAuthToken(null);
              setUser(null);
            }
          } else {
            // If fetching portfolio fails, token might be invalid or expired
            console.error("Failed to fetch user portfolio with token. Status:", res.status);
            localStorage.removeItem("token"); // Clear invalid token
            setAuthToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error("Error during authentication initialization:", error);
          localStorage.removeItem("token"); // Clear token on error
          setAuthToken(null);
          setUser(null);
        }
      }
      setLoading(false); // Auth check is complete regardless of outcome
    };

    initializeAuth();
  }, [authToken]); // Re-run this effect if authToken changes

  const login = (token) => {
    localStorage.setItem("token", token);
    setAuthToken(token);
    // When logging in, trigger the useEffect to fetch user data immediately
    // by updating authToken state, which is a dependency of useEffect.
    // The useEffect will then fetch the user data and set the 'user' state.
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null); // Clear user on logout
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout, isAuthenticated: !!authToken, loading }}>
      {/* Children are rendered only when auth loading is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
