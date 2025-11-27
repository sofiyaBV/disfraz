import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import dataProvider from "../services/dataProvider";

const useCart = (onCartUpdate) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const addToCart = async (productAttributeId, quantity = 1) => {
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

      if (typeof onCartUpdate === 'function') {
        await onCartUpdate();
      }

      window.dispatchEvent(new CustomEvent('cartUpdated'));

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
