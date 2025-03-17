import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase.config"; // Import Firebase Auth
import { onAuthStateChanged, signOut } from "firebase/auth";

// Create an authentication context
const AuthContext = createContext();

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading once user is detected
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  // Logout function
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
