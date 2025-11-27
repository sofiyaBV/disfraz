import httpClient from "./httpClient";
import { API_BASE_URL } from "./api";

export const fetchMyCart = async () => {
  const url = `${API_BASE_URL}/cart/my`;
  const response = await httpClient(url);
  return { data: response };
};

export const addToCart = async ({ productAttributeId, quantity }) => {
  const url = `${API_BASE_URL}/cart`;
  const response = await httpClient(url, {
    method: "POST",
    body: JSON.stringify({ productAttributeId, quantity }),
  });
  return { data: response };
};

export const updateCartItem = async (cartItemId, quantity) => {
  const url = `${API_BASE_URL}/cart/${cartItemId}`;
  const response = await httpClient(url, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
  return { data: response };
};

export const removeFromCart = async (cartItemId) => {
  const url = `${API_BASE_URL}/cart/${cartItemId}`;
  const response = await httpClient(url, {
    method: "DELETE",
  });
  return { data: response };
};

export const clearCart = async (cartItems) => {
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
