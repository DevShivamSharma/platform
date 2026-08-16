import { createContext, useContext, useState, useCallback } from "react";

const HARDCODED_EMAIL = "shivams967@gmail.com";
const HARDCODED_PASSWORD = "Shivam@1212";
const STORAGE_KEY = "platform_auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const login = useCallback((email, password) => {
    if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: "Invalid email or password" };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
