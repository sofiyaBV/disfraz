console.log("Environment variables:", process.env);
console.log(
  "REACT_APP_JSON_SERVER_URL:",
  process.env.REACT_APP_JSON_SERVER_URL
);

const apiUrl = process.env.REACT_APP_JSON_SERVER_URL;

if (!apiUrl || typeof apiUrl !== "string" || apiUrl.trim() === "") {
  throw new Error(
    "REACT_APP_JSON_SERVER_URL is not defined or invalid in .env"
  );
}

const httpClient = async (url, options = {}) => {
  const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  options.headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  try {
    console.log("Sending request to:", url, "with options:", options);
    const response = await fetch(url, options);
    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const getProducts = async (params = {}) => {
  const {
    page = 1,
    perPage = 20,
    sortField = "id",
    sortOrder = "ASC",
    filter = {},
  } = typeof params === "object" ? params : {};

  console.log("Pagination params:", {
    page,
    perPage,
    sortField,
    sortOrder,
    filter,
  });

  const query = new URLSearchParams({
    page: page.toString(),
    limit: perPage.toString(),
    sort: sortField,
    order: sortOrder.toLowerCase(),
    ...filter,
  });

  const url = `${apiUrl}/products?${query.toString()}`;
  console.log("Fetching products from:", url);

  try {
    const response = await httpClient(url);
    console.log("API response:", response);

    const total = Array.isArray(response)
      ? response.length
      : response.total || 0;

    return {
      data: Array.isArray(response) ? response : response.data || [],
      total,
    };
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw new Error(error.message || "Ошибка при загрузке товаров");
  }
};

export const getProductById = async (id) => {
  const url = `${apiUrl}/products/${id}`;
  console.log("Fetching product from:", url);

  try {
    const response = await httpClient(url);
    console.log("API response:", response);
    return response;
  } catch (error) {
    console.error("Error in getProductById:", error);
    throw new Error(error.message || "Ошибка при загрузке товара");
  }
};
