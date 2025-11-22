import { fetchUtils } from "react-admin";
import { stringify } from "query-string";

const apiUrl = import.meta.env.VITE_JSON_SERVER_URL;

interface HttpClientOptions {
  headers?: Headers;
  method?: string;
  body?: string | FormData;
}

const httpClient = (url: string, options: HttpClientOptions = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }

  const token = localStorage.getItem("token");
  if (token) {
    options.headers.set("Authorization", `Bearer ${token}`);
  }

  return fetchUtils.fetchJson(url, options);
};

const hasFiles = (data: Record<string, any>): boolean => {
  if (!data || typeof data !== "object") return false;

  if (data.images && Array.isArray(data.images)) {
    return data.images.some((item: any) => item?.rawFile);
  }

  return false;
};

const buildFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;

    const value = data[key];

    if (key === "images" && Array.isArray(value)) {
      value.forEach((file: any) => {
        if (file?.rawFile) {
          formData.append("images", file.rawFile);
        } else if (file?.url || typeof file === "string") {
          formData.append("existingImages", file.url || file);
        }
      });
    } else if (Array.isArray(value)) {
      value.forEach((item: any) => {
        formData.append(key, item);
      });
    } else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  }

  return formData;
};

const fetchWithFormData = async (
  url: string,
  method: string,
  formData: FormData,
) => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    body: formData,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  return { data: json };
};

export const dataProvider = {
  getList: (resource: string, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const query = {
      sortBy: `${field}:${order}`,
      search: params.filter.q,
      limit: perPage,
      page: page,
    };

    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ json }) => ({
      data: json.data,
      total: json.total,
    }));
  },

  getOne: (resource: string, params: any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: json,
    })),

  getMany: (resource: string, params: any) => {
    const query = { ids: params.ids.join(",") };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ json }) => ({
      data: json.data || json,
    }));
  },

  getManyReference: (resource: string, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const query = {
      sortBy: `${field}:${order}`,
      limit: perPage,
      page: page,
      [params.target]: params.id,
    };

    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ json }) => ({
      data: json.data,
      total: json.total,
    }));
  },

  create: (resource: string, params: any) => {
    if (resource === "products" && hasFiles(params.data)) {
      const formData = buildFormData(params.data);
      return fetchWithFormData(`${apiUrl}/${resource}`, "POST", formData);
    }

    return httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    }));
  },

  update: (resource: string, params: any) => {
    if (resource === "products" && hasFiles(params.data)) {
      const formData = buildFormData(params.data);
      return fetchWithFormData(
        `${apiUrl}/${resource}/${params.id}`,
        "PATCH",
        formData,
      );
    }

    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  updateMany: (resource: string, params: any) => {
    const updatePromises = params.ids.map((id: any) =>
      httpClient(`${apiUrl}/${resource}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(params.data),
      }),
    );

    return Promise.all(updatePromises).then(() => ({
      data: params.ids,
    }));
  },

  delete: (resource: string, params: any) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(() => ({
      data: { id: params.id },
    }));
  },

  deleteMany: (resource: string, params: any) => {
    const deletePromises = params.ids.map((id: any) =>
      httpClient(`${apiUrl}/${resource}/${id}`, {
        method: "DELETE",
      }),
    );

    return Promise.all(deletePromises).then(() => ({
      data: params.ids,
    }));
  },
};
