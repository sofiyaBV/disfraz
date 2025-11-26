import httpClient from "./httpClient";
import { API_BASE_URL } from "./api";

export const fetchUserProfile = async () => {
  const url = `${API_BASE_URL}/auth/profile`;

  try {
    const response = await httpClient(url);
    return { data: response };
  } catch (error) {
    throw new Error(error.message || "Помилка при завантаженні профілю");
  }
};

export const updateUserProfile = async (data) => {
  const url = `${API_BASE_URL}/auth/profile`;

  try {
    const response = await httpClient(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return { data: response };
  } catch (error) {
    throw new Error(error.message || "Помилка при оновленні профілю");
  }
};

export const register = async ({ email, phone, password }) => {
  const response = await httpClient(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ email, phone, password }),
  });

  return { data: response };
};

export const signin = async ({ email, phone, password }) => {
  const response = await httpClient(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    body: JSON.stringify({ email, phone, password }),
  });


  return { data: response };
};


export const logout = async () => {

  await httpClient(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
  });
};

const authService = {
  fetchUserProfile,
  updateUserProfile,
  register,
  signin,
  logout,
};

export default authService;
