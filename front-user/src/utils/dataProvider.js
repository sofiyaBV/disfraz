// src/utils/api.js
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
  if (!options.headers) {
    options.headers = {
      Accept: "application/json",
    };
  }

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
    perPage = 10,
    sortField = "id",
    sortOrder = "ASC",
  } = typeof params === "object" ? params : {};

  const query = new URLSearchParams({
    sortBy: `${sortField}:${sortOrder}`,
    limit: perPage.toString(),
    page: page.toString(),
  });

  const url = `${apiUrl}/products?${query.toString()}`;
  console.log("Fetching products from:", url);

  try {
    const json = await httpClient(url);
    console.log("API response:", json);
    if (Array.isArray(json)) {
      return {
        data: json,
        total: json.length,
      };
    }
    return {
      data: json.data,
      total: json.total,
    };
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw new Error(error.message || "Ошибка при загрузке товаров");
  }
};
