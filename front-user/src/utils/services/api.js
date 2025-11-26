const apiUrl = process.env.REACT_APP_JSON_SERVER_URL;

const getApiBaseUrl = () => {
  if (!apiUrl || typeof apiUrl !== "string" || apiUrl.trim() === "") {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL: REACT_APP_JSON_SERVER_URL must be defined in production environment"
      );
    }

    console.warn(
      "REACT_APP_JSON_SERVER_URL is not defined. Using development fallback: http://localhost:3000"
    );
    return "http://localhost:3000";
  }

  return apiUrl.trim();
};

export const API_BASE_URL = getApiBaseUrl();

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
