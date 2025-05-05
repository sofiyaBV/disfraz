const apiUrl = process.env.REACT_APP_JSON_SERVER_URL;

if (!apiUrl || typeof apiUrl !== "string" || apiUrl.trim() === "") {
  throw new Error(
    "REACT_APP_JSON_SERVER_URL is not defined or invalid in .env"
  );
}

const httpClient = async (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
  }

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
    throw new Error(error.message || "Ошибка при загрузке товаров");
  }
};

const fetchProductById = async (id) => {
  const url = `${apiUrl}/products/${id}`;
  console.log("Fetching product from:", url);

  try {
    const response = await httpClient(url);
    console.log("API response:", response);
    return { data: response };
  } catch (error) {
    console.error("Error in fetchProductById:", error);
    throw new Error(error.message || "Ошибка при загрузке товара");
  }
};

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
      error.message || "Ошибка при загрузке связей продукт-атрибут"
    );
  }
};

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
    throw new Error(error.message || "Ошибка при загрузке атрибутов");
  }
};

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
    throw new Error(error.message || "Ошибка при загрузке комментариев");
  }
};

const createUser = async (params) => {
  const { email, phone, password } = params;

  const response = await httpClient(`${apiUrl}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ email, phone, password }),
  });

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

const signinUser = async (params) => {
  const { email, phone, password } = params;

  const response = await httpClient(`${apiUrl}/auth/signin`, {
    method: "POST",
    body: JSON.stringify({ email, phone, password }),
  });
  console.log("Signin response:", response);

  if (response.access_token) {
    localStorage.setItem("token", response.access_token);
    console.log("Token saved to localStorage:", response.access_token);
  } else {
    console.warn("No access_token in signin response:", response);
  }

  return { data: response };
};

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

const dataProvider = {
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
  getOne: async (resource, params) => {
    switch (resource) {
      case "products":
        return fetchProductById(params.id);
      default:
        throw new Error(`Unsupported resource: ${resource}`);
    }
  },
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
  signin: async (params) => {
    return signinUser(params);
  },
};

export default dataProvider;
