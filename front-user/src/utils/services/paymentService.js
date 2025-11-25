import httpClient from "./httpClient";
import { API_BASE_URL } from "./api";

const paymentService = {
  createCheckoutSession: async (sessionData) => {
    const url = `${API_BASE_URL}/payment/create-checkout-session`;
    const response = await httpClient(url, {
      method: "POST",
      body: JSON.stringify(sessionData),
    });
    return { data: response };
  },

  getPaymentStatus: async (paymentId) => {
    const url = `${API_BASE_URL}/payment/${paymentId}`;
    const response = await httpClient(url, {
      method: "GET",
    });
    return { data: response };
  },
};

export default paymentService;
