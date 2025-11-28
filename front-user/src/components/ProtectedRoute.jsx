import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/context/AuthContext";

//Компонент для захисту маршрутів від неавторизованих користувачів

const ProtectedRoute = ({ children, redirectTo = "/" }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Показуємо loader поки перевіряється автентифікація
  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>Завантаження...</div>
      </div>
    );
  }

  // Якщо не авторизований - редірект на головну/логін
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Якщо авторизований - показуємо захищений контент
  return children;
};

// Простий inline стиль для loader
const styles = {
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    fontSize: "18px",
    color: "#666",
  },
  loadingSpinner: {
    padding: "20px",
  },
};

export default ProtectedRoute;
