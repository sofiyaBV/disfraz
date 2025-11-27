import httpClient from "./httpClient";
import { API_BASE_URL, buildQueryParams, normalizeListResponse } from "./api";

export const fetchComments = async (params = {}) => {
  const queryParams = buildQueryParams(params);

  const { filter = {} } = params;
  if (filter.productAttributeId) {
    queryParams.productAttributeId = filter.productAttributeId;
  }

  const query = new URLSearchParams(queryParams);
  const url = `${API_BASE_URL}/comments?${query.toString()}`;

  const response = await httpClient(url, { skipAuth: true });
  return normalizeListResponse(response);
};

export const createComment = async ({ productAttributeId, content }) => {
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
