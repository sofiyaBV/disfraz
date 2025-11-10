import httpClient from "./httpClient";
import { API_BASE_URL } from "./api";

// Отримання профілю поточного користувача
export const fetchUserProfile = async () => {
  const url = `${API_BASE_URL}/auth/profile`;

  try {
    const response = await httpClient(url);
    return { data: response };
  } catch (error) {
    throw new Error(error.message || "Помилка при завантаженні профілю");
  }
};

// Оновлення даних профілю користувача
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

// Реєстрація нового користувача
export const register = async ({ email, phone, password }) => {
  const response = await httpClient(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ email, phone, password }),
  });

  // Зберігаємо токен після успішної реєстрації
  if (response.access_token) {
    localStorage.setItem("token", response.access_token);
  }

  return { data: response };
};

// Авторизація користувача
export const signin = async ({ email, phone, password }) => {
  const response = await httpClient(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    body: JSON.stringify({ email, phone, password }),
  });

  // Зберігаємо токен після успішного входу
  if (response.access_token) {
    localStorage.setItem("token", response.access_token);
  }

  return { data: response };
};

// Вихід з системи
export const logout = () => {
  localStorage.removeItem("token");
};

const authService = {
  fetchUserProfile,
  updateUserProfile,
  register,
  signin,
  logout,
};

export default authService;
