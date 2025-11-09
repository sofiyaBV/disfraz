import httpClient from "./httpClient";
import { API_BASE_URL, buildQueryParams, normalizeListResponse } from "./api";

// Отримання списку товарів з підтримкою пагінації та фільтрації
export const fetchProducts = async (params = {}) => {
  const queryParams = buildQueryParams(params);

  // Додаткова фільтрація
  const { filter = {} } = params;
  if (filter.theme) {
    queryParams["attribute.theme"] = filter.theme;
  }
  if (filter.attributeId) {
    queryParams.attributeId = filter.attributeId;
  }
  if (filter.productIds) {
    queryParams.id = filter.productIds.join(",");
  }

  const query = new URLSearchParams(queryParams);
  const url = `${API_BASE_URL}/products?${query.toString()}`;

  try {
    const response = await httpClient(url);
    return normalizeListResponse(response);
  } catch (error) {
    throw new Error(error.message || "Помилка при завантаженні товарів");
  }
};

// Отримання конкретного товару за ID
export const fetchProductById = async (id) => {
  const url = `${API_BASE_URL}/products/${id}`;

  try {
    const response = await httpClient(url);
    return { data: response };
  } catch (error) {
    throw new Error(error.message || "Помилка при завантаженні товару");
  }
};

const productService = {
  fetchProducts,
  fetchProductById,
};
export default productService;
