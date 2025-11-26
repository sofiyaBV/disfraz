import httpClient from "./httpClient";
import { API_BASE_URL } from "./api";

// Отримання кошика поточного користувача
export const fetchMyCart = async () => {
  const url = `${API_BASE_URL}/cart/my`;
  const response = await httpClient(url);
  return response;
};

// Додавання товару до кошика
export const addToCart = async ({ productAttributeId, quantity }) => {
  const url = `${API_BASE_URL}/cart`;
  const response = await httpClient(url, {
    method: "POST",
    body: JSON.stringify({ productAttributeId, quantity }),
  });

  return response;
};

// Оновлення кількості товару в кошику
export const updateCartItem = async (cartItemId, quantity) => {
  const url = `${API_BASE_URL}/cart/${cartItemId}`;
  const response = await httpClient(url, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });

  return response;
};

// Видалення товару з кошика
export const removeFromCart = async (cartItemId) => {
  const url = `${API_BASE_URL}/cart/${cartItemId}`;
  await httpClient(url, {
    method: "DELETE",
  });
};

// Очищення всього кошика
export const clearCart = async (cartItems) => {
  // Видаляємо всі items по черзі
  const promises = cartItems.map((item) => removeFromCart(item.id));
  await Promise.all(promises);
};

const cartService = {
  fetchMyCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

export default cartService;
