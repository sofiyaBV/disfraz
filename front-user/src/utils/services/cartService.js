import httpClient from "./httpClient";
import { API_BASE_URL } from "./api";

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

  return { data: response };
};

// Отримання товарів у кошику
export const fetchCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Необхідна авторизація");
  }

  const url = `${API_BASE_URL}/cart`;

  const response = await httpClient(url);
  return { data: response };
};

// Видалення товару з кошика
export const removeFromCart = async (cartItemId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Необхідна авторизація");
  }

  const url = `${API_BASE_URL}/cart/${cartItemId}`;

  const response = await httpClient(url, {
    method: "DELETE",
  });

  return { data: response };
};

const cartService = {
  addToCart,
  fetchCart,
  removeFromCart,
};
export default cartService;
