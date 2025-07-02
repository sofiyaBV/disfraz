// Отримуємо URL API з змінних середовища
const apiUrl = process.env.REACT_APP_JSON_SERVER_URL;

// Перевіряємо налаштування URL API
if (!apiUrl || typeof apiUrl !== "string" || apiUrl.trim() === "") {
  throw new Error(
    "REACT_APP_JSON_SERVER_URL is not defined or invalid in .env"
  );
}

// HTTP клієнт для роботи з API
const httpClient = async (url, options = {}) => {
  // Встановлюємо базові заголовки
  if (!options.headers) {
    options.headers = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
  }

  // Додаємо токен авторизації з localStorage
  const token = localStorage.getItem("token");
  const skipAuth = options.skipAuth || false;
  if (token && !skipAuth) {
    options.headers.set("Authorization", `Bearer ${token}`);
    console.log("Authorization header set:", `Bearer ${token}`);
  } else if (!token) {
    console.log("No token found in localStorage");
  }

  try {
    const response = await fetch(url, options);
    console.log("Response status:", response.status);

    // Обробляємо помилки запиту
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || "Request failed";
      } catch (e) {
        errorMessage = errorText || "Request failed";
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Отримання профілю поточного користувача
const fetchUserProfile = async () => {
  const url = `${apiUrl}/auth/profile`;
  console.log("Fetching user profile from:", url);

  try {
    const response = await httpClient(url);
    console.log("Profile response:", response);
    return { data: response };
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    throw new Error(error.message || "Помилка при завантаженні профілю");
  }
};

// Оновлення даних профілю користувача
const updateUserProfile = async (params) => {
  const url = `${apiUrl}/auth/profile`;
  console.log("Updating user profile with payload:", params.data);

  try {
    const response = await httpClient(url, {
      method: "PUT",
      body: JSON.stringify(params.data),
    });
    console.log("Profile update response:", response);
    return { data: response };
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw new Error(error.message || "Помилка при оновленні профілю");
  }
};

// Отримання списку товарів з підтримкою пагінації та фільтрації
const fetchProducts = async (params = {}) => {
  const {
    page = 1,
    perPage = 20,
    sortField = "id",
    sortOrder = "ASC",
    filter = {},
  } = params;

  console.log("Pagination params:", {
    page,
    perPage,
    sortField,
    sortOrder,
    filter,
  });

  // Формуємо параметри фільтрації
  const queryFilter = {};
  if (filter.theme) {
    queryFilter["attribute.theme"] = filter.theme;
  }
  if (filter.attributeId) {
    queryFilter["attributeId"] = filter.attributeId;
  }
  if (filter.productIds) {
    queryFilter.id = filter.productIds.join(",");
  }

  const query = new URLSearchParams({
    page: page.toString(),
    limit: perPage.toString(),
    sort: sortField,
    order: sortOrder.toLowerCase(),
    ...queryFilter,
  });

  const url = `${apiUrl}/products?${query.toString()}`;
  console.log("Fetching products from:", url);

  try {
    const response = await httpClient(url);
    console.log("API response for products:", response);

    const total = Array.isArray(response)
      ? response.length
      : response.total || 0;

    return {
      data: Array.isArray(response) ? response : response.data || [],
      total,
    };
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    throw new Error(error.message || "Помилка при завантаженні товарів");
  }
};

// Отримання конкретного товару за ID
const fetchProductById = async (id) => {
  const url = `${apiUrl}/products/${id}`;
  console.log("Fetching product from:", url);

  try {
    const response = await httpClient(url);
    console.log("API response:", response);
    return { data: response };
  } catch (error) {
    console.error("Error in fetchProductById:", error);
    throw new Error(error.message || "Помилка при завантаженні товару");
  }
};

// Отримання атрибутів товарів з фільтрацією по темі
const fetchProductAttributes = async (params = {}) => {
  const {
    page = 1,
    perPage = 20,
    sortField = "id",
    sortOrder = "ASC",
    filter = {},
  } = params;

  const queryFilter = {};
  if (filter.productId) {
    queryFilter.productId = filter.productId;
  }
  if (filter.attributeId) {
    queryFilter.attributeId = filter.attributeId;
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
    queryFilter.attributeId = attributeIds.join(",");
  }

  const query = new URLSearchParams({
    page: page.toString(),
    limit: perPage.toString(),
    sort: sortField,
    order: sortOrder.toLowerCase(),
    ...queryFilter,
  });

  const url = `${apiUrl}/product-attribute?${query.toString()}`;
  console.log("Fetching product-attributes from:", url);

  try {
    const response = await httpClient(url);
    console.log("API response for product-attributes:", response);

    const total = Array.isArray(response)
      ? response.length
      : response.total || 0;

    return {
      data: Array.isArray(response) ? response : response.data || [],
      total,
    };
  } catch (error) {
    console.error("Error in fetchProductAttributes:", error);
    throw new Error(
      error.message || "Помилка при завантаженні зв'язків продукт-атрибут"
    );
  }
};

// Отримання списку атрибутів
const fetchAttributes = async (params = {}) => {
  const {
    page = 1,
    perPage = 20,
    sortField = "id",
    sortOrder = "ASC",
    filter = {},
  } = params;

  const queryFilter = {};
  if (filter.theme) {
    queryFilter.theme = filter.theme;
  }

  const query = new URLSearchParams({
    page: page.toString(),
    limit: perPage.toString(),
    sort: sortField,
    order: sortOrder.toLowerCase(),
    ...queryFilter,
  });

  const url = `${apiUrl}/attributes?${query.toString()}`;
  console.log("Fetching attributes from:", url);

  try {
    const response = await httpClient(url);
    console.log("API response for attributes:", response);

    const total = Array.isArray(response)
      ? response.length
      : response.total || 0;

    return {
      data: Array.isArray(response) ? response : response.data || [],
      total,
    };
  } catch (error) {
    console.error("Error in fetchAttributes:", error);
    throw new Error(error.message || "Помилка при завантаженні атрибутів");
  }
};

// Отримання коментарів без авторизації
const fetchComments = async (params = {}) => {
  const {
    page = 1,
    perPage = 20,
    sortField = "id",
    sortOrder = "ASC",
    filter = {},
  } = params;

  const queryFilter = {};
  if (filter.productAttributeId) {
    queryFilter.productAttributeId = filter.productAttributeId;
  }

  const query = new URLSearchParams({
    page: page.toString(),
    limit: perPage.toString(),
    sort: sortField,
    order: sortOrder.toLowerCase(),
    ...queryFilter,
  });

  const url = `${apiUrl}/comments?${query.toString()}`;
  console.log("Fetching comments from:", url);

  try {
    // Пропускаємо авторизацію для читання коментарів
    const response = await httpClient(url, { skipAuth: true });
    console.log("API response for comments:", response);

    const total = Array.isArray(response)
      ? response.length
      : response.total || 0;

    return {
      data: Array.isArray(response) ? response : response.data || [],
      total,
    };
  } catch (error) {
    console.error("Error in fetchComments:", error);
    throw new Error(error.message || "Помилка при завантаженні коментарів");
  }
};

// Реєстрація нового користувача
const createUser = async (params) => {
  const { email, phone, password } = params;

  const response = await httpClient(`${apiUrl}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ email, phone, password }),
  });

  // Зберігаємо токен після успішної реєстрації
  if (response.access_token) {
    localStorage.setItem("token", response.access_token);
    console.log(
      "Token saved to localStorage after registration:",
      response.access_token
    );
  } else {
    console.warn("No access_token in registration response:", response);
  }

  return { data: response };
};

// Авторизація користувача
const signinUser = async (params) => {
  const { email, phone, password } = params;

  const response = await httpClient(`${apiUrl}/auth/signin`, {
    method: "POST",
    body: JSON.stringify({ email, phone, password }),
  });
  console.log("Signin response:", response);

  // Зберігаємо токен після успішного входу
  if (response.access_token) {
    localStorage.setItem("token", response.access_token);
    console.log("Token saved to localStorage:", response.access_token);
  } else {
    console.warn("No access_token in signin response:", response);
  }

  return { data: response };
};

// Додавання товару до кошика
const createCartItem = async (params) => {
  const token = localStorage.getItem("token");
  console.log("Token for cart:", token);
  if (!token) {
    throw new Error("Необхідна авторизація для додавання до кошика");
  }

  const { productAttributeId, quantity } = params.data;
  const url = `${apiUrl}/cart`;
  console.log("Creating cart item with payload:", params.data);

  const response = await httpClient(url, {
    method: "POST",
    body: JSON.stringify({ productAttributeId, quantity }),
  });

  return { data: response };
};

// Створення нового коментаря
const createComment = async (params) => {
  const token = localStorage.getItem("token");
  console.log("Token for comment:", token);
  if (!token) {
    throw new Error("Необхідна авторизація для надсилання коментаря");
  }

  const { productAttributeId, content } = params.data;
  const url = `${apiUrl}/comments`;
  console.log("Creating comment with payload:", params.data);

  const response = await httpClient(url, {
    method: "POST",
    body: JSON.stringify({ productAttributeId, content }),
  });

  return { data: response };
};

// Головний провайдер даних для роботи з API
const dataProvider = {
  // Отримання списків даних
  getList: async (resource, params) => {
    switch (resource) {
      case "products":
        return fetchProducts(params);
      case "product-attributes":
        return fetchProductAttributes(params);
      case "attributes":
        return fetchAttributes(params);
      case "comments":
        return fetchComments(params);
      default:
        throw new Error(`Unsupported resource: ${resource}`);
    }
  },
  // Отримання одного запису
  getOne: async (resource, params) => {
    switch (resource) {
      case "products":
        return fetchProductById(params.id);
      case "user/profile":
        return fetchUserProfile();
      default:
        throw new Error(`Unsupported resource: ${resource}`);
    }
  },
  // Створення нових записів
  create: async (resource, params) => {
    switch (resource) {
      case "users":
        return createUser(params.data);
      case "cart":
        return createCartItem(params);
      case "comments":
        return createComment(params);
      default:
        throw new Error(`Unsupported resource: ${resource}`);
    }
  },
  // Оновлення існуючих записів
  update: async (resource, params) => {
    switch (resource) {
      case "user/profile":
        return updateUserProfile(params);
      default:
        throw new Error(`Unsupported resource: ${resource}`);
    }
  },
  // Метод для авторизації
  signin: async (params) => {
    return signinUser(params);
  },
};

export default dataProvider;