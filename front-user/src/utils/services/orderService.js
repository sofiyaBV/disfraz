import httpClient from "./httpClient";
import { API_BASE_URL } from "./api";

const orderService = {
  createOrder: async (orderData) => {
    const url = `${API_BASE_URL}/orders`;
    const response = await httpClient(url, {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    return { data: response };
  },

  getOrders: async () => {
    const url = `${API_BASE_URL}/orders`;
    const response = await httpClient(url, {
      method: "GET",
    });
    return { data: response };
  },

  getOrderById: async (id) => {
    const url = `${API_BASE_URL}/orders/${id}`;
    const response = await httpClient(url, {
      method: "GET",
    });
    return { data: response };
  },
};

export default orderService;
