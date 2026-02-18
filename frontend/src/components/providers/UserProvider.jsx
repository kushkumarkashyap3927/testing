import React, { createContext, useState, useContext } from "react";
import { redirect } from "react-router-dom";


const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Call this after successful login
  const loginUser = (userData) => {
    setUser(userData);
  };

  // Call this to logout
  const logoutUser = () => {
    setUser(null);
    redirect("/login"); // Redirect to login page after logout

  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
