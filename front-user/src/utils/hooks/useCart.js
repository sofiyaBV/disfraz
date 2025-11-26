import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import dataProvider from "../services/dataProvider";

const useCart = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const addToCart = async (productAttributeId, quantity = 1) => {
    // Скидаємо попередні повідомлення
    setMessage(null);
    setError(null);

    if (!isAuthenticated) {
      setError("Будь ласка, увійдіть в акаунт для додавання в кошик!");
      return false;
    }

    setLoading(true);

    try {
      await dataProvider.create("cart", {
        data: { productAttributeId, quantity },
      });
      setMessage("Товар додано до кошика!");
      return true;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Помилка при додаванні до кошика:", err);
      }
      setError(
        "Помилка при додаванні до кошика: " +
          (err.message || "Невідома помилка")
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessage(null);
    setError(null);
  };

  return {
    addToCart,
    clearMessages,
    loading,
    message,
    error,
  };
};

export default useCart;
