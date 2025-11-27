import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { API_BASE_URL } from "../services/api";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Перевірка стану автентифікації через cookie-based session
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await authService.fetchUserProfile();
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Auth check failed:", error);
      }
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Глобальна обробка 401 Unauthorized з будь-якого API запиту
  useEffect(() => {
    const handleUnauthorized = () => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Unauthorized event received - logging out user');
      }
      setUser(null);
      setIsAuthenticated(false);
      // Редірект на головну буде через ProtectedRoute
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback(async () => {
    setIsAuthenticated(true);
    await checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Logout error:", error);
      }
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Мемоізація value для оптимізації ре-рендерів
  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      isLoading,
      login,
      logout,
      checkAuth,
    }),
    [isAuthenticated, user, isLoading, login, logout, checkAuth]
  );

  return (
    <AuthContext.Provider value={value}>
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
