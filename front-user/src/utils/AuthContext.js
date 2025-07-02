import { createContext, useContext, useState, useEffect } from "react";

// Контекст для управління авторизацією користувачів
const AuthContext = createContext();

// Провайдер авторизації для всього додатку
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ініціалізація - перевіряємо наявність токена при завантаженні
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      console.log("Token found in localStorage:", storedToken);
    } else {
      console.log("No token found in localStorage");
    }
    setIsLoading(false);
  }, []);

  // Синхронізація з localStorage при зміні в інших вкладках
  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        setToken(null);
        setIsAuthenticated(false);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Функція входу користувача в систему
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    console.log("User logged in with token:", newToken);
  };

  // Функція виходу користувача з системи
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    console.log("User logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Хук для використання контексту авторизації
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
