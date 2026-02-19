import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const setUser = (u) => {
    setUserState(u);
    try {
      if (u) localStorage.setItem("user", JSON.stringify(u));
      else localStorage.removeItem("user");
    } catch (e) {
      // ignore localStorage errors
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "user") {
        try {
          setUserState(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setUserState(null);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
