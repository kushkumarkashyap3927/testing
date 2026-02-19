import React, { createContext, useState, useContext, useEffect } from "react";


const UserContext = createContext();

export function UserProvider({ children }) {

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    setMounted(true);
    // Sync user state with localStorage
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logoutUser = (cb) => {
    setUser(null);
    localStorage.removeItem("user");
    if (typeof cb === "function") cb();
  };

  if(!mounted) return null;

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
