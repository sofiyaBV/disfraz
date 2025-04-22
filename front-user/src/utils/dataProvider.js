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
  // Устанавливаем заголовки по умолчанию
  const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // Объединяем заголовки, если они переданы в options
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
    perPage = 1000,
    sortField = "id",
    sortOrder = "ASC",
    filter = {},
  } = typeof params === "object" ? params : {};

  // Формируем параметры запроса в формате JSON Server
  const query = new URLSearchParams({
    _page: page.toString(),
    _limit: perPage.toString(),
    _sort: sortField,
    _order: sortOrder.toLowerCase(),
    ...filter,
  });

  const url = `${apiUrl}/products?${query.toString()}`;
  console.log("Fetching products from:", url);

  try {
    const response = await httpClient(url);
    console.log("API response:", response);

    // JSON Server возвращает массив данных, но нам нужно общее количество записей
    // Для этого можно использовать заголовок X-Total-Count (нужно настроить fetch для получения заголовков)
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

// Дополнительная функция для получения одного продукта по ID
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
