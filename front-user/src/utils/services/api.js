// Отримуємо URL API з env
const apiUrl = process.env.REACT_APP_JSON_SERVER_URL;

// Перевірка налаштування
if (!apiUrl || typeof apiUrl !== "string" || apiUrl.trim() === "") {
  throw new Error(
    "REACT_APP_JSON_SERVER_URL is not defined or invalid in .env"
  );
}

export const API_BASE_URL = apiUrl;

// Helper для формування query параметрів
export const buildQueryParams = (params = {}) => {
  const {
    page = 1,
    perPage = 20,
    sortField = "id",
    sortOrder = "ASC",
    filter = {},
  } = params;

  return {
    page: page.toString(),
    limit: perPage.toString(),
    sort: sortField,
    order: sortOrder.toLowerCase(),
    ...filter,
  };
};

// Helper для обробки відповідей з пагінацією
export const normalizeListResponse = (response) => {
  const total = Array.isArray(response) ? response.length : response.total || 0;

  return {
    data: Array.isArray(response) ? response : response.data || [],
    total,
  };
};

const api = {
  API_BASE_URL,
  buildQueryParams,
  normalizeListResponse,
};

export default api;
