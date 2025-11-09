import httpClient from "./httpClient";
import { API_BASE_URL, buildQueryParams, normalizeListResponse } from "./api";

// Отримання коментарів без авторизації
export const fetchComments = async (params = {}) => {
  const queryParams = buildQueryParams(params);

  const { filter = {} } = params;
  if (filter.productAttributeId) {
    queryParams.productAttributeId = filter.productAttributeId;
  }

  const query = new URLSearchParams(queryParams);
  const url = `${API_BASE_URL}/comments?${query.toString()}`;

  try {
    // Пропускаємо авторизацію для читання коментарів
    const response = await httpClient(url, { skipAuth: true });
    return normalizeListResponse(response);
  } catch (error) {
    throw new Error(error.message || "Помилка при завантаженні коментарів");
  }
};

// Створення нового коментаря
export const createComment = async ({ productAttributeId, content }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Необхідна авторизація для надсилання коментаря");
  }

  const url = `${API_BASE_URL}/comments`;

  const response = await httpClient(url, {
    method: "POST",
    body: JSON.stringify({ productAttributeId, content }),
  });

  return { data: response };
};

const commentService = {
  fetchComments,
  createComment,
};
export default commentService;
