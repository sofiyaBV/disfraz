import httpClient from "./httpClient";
import { API_BASE_URL, buildQueryParams, normalizeListResponse } from "./api";

export const fetchAttributes = async (params = {}) => {
  const queryParams = buildQueryParams(params);

  const { filter = {} } = params;
  if (filter.theme) {
    queryParams.theme = filter.theme;
  }

  const query = new URLSearchParams(queryParams);
  const url = `${API_BASE_URL}/attributes?${query.toString()}`;

  const response = await httpClient(url);
  return normalizeListResponse(response);
};

export const fetchProductAttributes = async (params = {}) => {
  const queryParams = buildQueryParams(params);

  const { filter = {} } = params;
  if (filter.productId) {
    queryParams.productId = filter.productId;
  }
  if (filter.attributeId) {
    queryParams.attributeId = filter.attributeId;
  }

  // Фільтрація по темі через запит атрибутів
  if (filter.theme) {
    const attributesResponse = await fetchAttributes({
      filter: { theme: filter.theme },
    });
    const attributeIds = attributesResponse.data.map((attr) => attr.id);
    if (attributeIds.length === 0) {
      return { data: [], total: 0 };
    }
    queryParams.attributeId = attributeIds.join(",");
  }

  const query = new URLSearchParams(queryParams);
  const url = `${API_BASE_URL}/product-attribute?${query.toString()}`;

  const response = await httpClient(url);
  return normalizeListResponse(response);
};

const attributeService = {
  fetchAttributes,
  fetchProductAttributes,
};
export default attributeService;
