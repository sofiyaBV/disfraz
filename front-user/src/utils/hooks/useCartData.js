import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import cartService from "../services/cartService";

const useCartData = () => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Завантаження кошика
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await cartService.fetchMyCart();
      setCartItems(data || []);
    } catch (err) {
      console.error("Помилка завантаження кошика:", err);
      setError(err.message || "Не вдалося завантажити кошик");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Оновлення кількості
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await cartService.updateCartItem(cartItemId, newQuantity);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Помилка оновлення кількості:", err);
      setError("Не вдалося оновити кількість");
    }
  };

  // Видалення товару
  const removeItem = async (cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId);
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (err) {
      console.error("Помилка видалення товару:", err);
      setError("Не вдалося видалити товар");
    }
  };

  // Очищення кошика
  const clearCart = async () => {
    try {
      await cartService.clearCart(cartItems);
      setCartItems([]);
    } catch (err) {
      console.error("Помилка очищення кошика:", err);
      setError("Не вдалося очистити кошик");
    }
  };

  // Завантажуємо при монтуванні
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Підрахунок підсумків
  const totalItems = cartItems.length;
  const totalDiscount = cartItems.reduce((sum, item) => {
    const product = item.productAttribute?.product;
    if (product?.discount > 0 && product?.newPrice) {
      return sum + (product.price - product.newPrice) * item.quantity;
    }
    return sum;
  }, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + Number(item.price);
  }, 0);

  return {
    cartItems,
    loading,
    error,
    totalItems,
    totalDiscount,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    refetch: fetchCart,
  };
};

export default useCartData;
