// utils/AuthContext.js
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );

  console.log("isAuthenticated on init:", isAuthenticated); // Добавляем отладку

  const login = (token) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    console.log("isAuthenticated after login:", true); // Отладка
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    console.log("isAuthenticated after logout:", false); // Отладка
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
