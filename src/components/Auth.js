import React, { useEffect, useState, createContext } from "react";
import { auth } from "../config/firebase";
// Create the context to hold the data and share it among all components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Set the current user in case the user is already logged in
  const [currentUser, setCurrentUser] = useState(() => auth.currentUser);

  // Grab the user from the firebase auth object
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      console.log("currentUser set in AuthProvider:", user);
    });
    return unsubscribe;
  }, []);
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
