import httpClient from "./httpClient";
import { API_BASE_URL } from "./api";

// Отримання кошика поточного користувача
export const fetchMyCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Необхідна авторизація");
  }

  const url = `${API_BASE_URL}/cart/my`;
  const response = await httpClient(url);
  return response;
};

// Додавання товару до кошика
export const addToCart = async ({ productAttributeId, quantity }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Необхідна авторизація для додавання до кошика");
  }

  const url = `${API_BASE_URL}/cart`;
  const response = await httpClient(url, {
    method: "POST",
    body: JSON.stringify({ productAttributeId, quantity }),
  });

  return response;
};

// Оновлення кількості товару в кошику
export const updateCartItem = async (cartItemId, quantity) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Необхідна авторизація");
  }

  const url = `${API_BASE_URL}/cart/${cartItemId}`;
  const response = await httpClient(url, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });

  return response;
};

// Видалення товару з кошика
export const removeFromCart = async (cartItemId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Необхідна авторизація");
  }

  const url = `${API_BASE_URL}/cart/${cartItemId}`;
  await httpClient(url, {
    method: "DELETE",
  });
};

// Очищення всього кошика
export const clearCart = async (cartItems) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Необхідна авторизація");
  }

  // Видаляємо всі items по черзі
  await Promise.all(cartItems.map((item) => removeFromCart(item.id)));
};

const cartService = {
  fetchMyCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

export default cartService;
