import { fetchUtils } from "react-admin";
import { stringify } from "query-string";

const apiUrl = import.meta.env.VITE_JSON_SERVER_URL;

// HTTP клієнт з автоматичним додаванням токена авторизації
const httpClient = (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }

  const token = localStorage.getItem("token");
  if (token) {
    options.headers.set("Authorization", `Bearer ${token}`);
  }

  return fetchUtils.fetchJson(url, options);
};

// Перевірка наявності файлів у даних для завантаження
const hasFiles = (data: any): boolean => {
  if (!data || typeof data !== "object") return false;

  if (data.images && Array.isArray(data.images)) {
    return data.images.some((item: any) => item && item.rawFile);
  }

  return false;
};

export const dataProvider = {
  // Отримання списку записів з підтримкою пагінації та сортування
  getList: (resource: string, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sortBy: field + ":" + order,
      search: params.filter.q,
      limit: JSON.stringify(perPage),
      page: JSON.stringify(page),
    };

    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ json }) => {
      return {
        data: json.data,
        total: json.total,
      };
    });
  },

  // Отримання одного запису за ID
  getOne: (resource: string, params: any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: json,
    })),

  // Створення запису з файлами через FormData
  createFormData: (resource: string, params: any) => {
    const formData = new FormData();

    for (const key in params.data) {
      if (params.data.hasOwnProperty(key)) {
        const value = params.data[key];

        if (key === "images" && Array.isArray(value)) {
          value.forEach((file: any, index: number) => {
            if (file && file.rawFile) {
              formData.append(`images`, file.rawFile);
            } else if (file && typeof file === "string") {
              formData.append(`images[${index}]`, file);
            }
          });
        } else if (Array.isArray(value)) {
          value.forEach((item: any, index: number) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      }
    }

    const options: any = {
      method: "POST",
      body: formData,
    };

    const token = localStorage.getItem("token");
    if (token) {
      options.headers = new Headers();
      options.headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${apiUrl}/${resource}`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        return {
          data: json,
        };
      });
  },

  // Створення нового запису
  create: (resource: string, params: any) => {
    if (resource === "products" && hasFiles(params.data)) {
      return dataProvider.createFormData(resource, params);
    }

    return httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    }));
  },

  // Оновлення запису з файлами через FormData
  updateFormData: (resource: string, params: any) => {
    const formData = new FormData();

    for (const key in params.data) {
      if (params.data.hasOwnProperty(key)) {
        const value = params.data[key];

        if (key === "images" && Array.isArray(value)) {
          value.forEach((file: any, index: number) => {
            if (file && file.rawFile) {
              formData.append(`images`, file.rawFile);
            } else if (file && (typeof file === "string" || file.url)) {
              const imageUrl = typeof file === "string" ? file : file.url;
              formData.append(`images[${index}]`, imageUrl);
            }
          });
        } else if (Array.isArray(value)) {
          value.forEach((item: any, index: number) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      }
    }

    const options: any = {
      method: "PATCH",
      body: formData,
    };

    const token = localStorage.getItem("token");
    if (token) {
      options.headers = new Headers();
      options.headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${apiUrl}/${resource}/${params.id}`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        return {
          data: json,
        };
      });
  },

  // Оновлення існуючого запису
  update: (resource: string, params: any) => {
    if (resource === "products" && hasFiles(params.data)) {
      return dataProvider.updateFormData(resource, params);
    }

    // Стандартне оновлення через JSON
    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  // Видалення запису
  delete: (resource: string, params: any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json })),
};
