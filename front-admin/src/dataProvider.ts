import { fetchUtils } from "react-admin";
import { stringify } from "query-string";

const apiUrl = import.meta.env.VITE_JSON_SERVER_URL;

// Настраиваем httpClient с добавлением токена в заголовки
const httpClient = (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }

  // Получаем токен из localStorage
  const token = localStorage.getItem("token");
  if (token) {
    options.headers.set("Authorization", `Bearer ${token}`);
  } else {
    console.log("No token found in localStorage");
  }

  return fetchUtils.fetchJson(url, options);
};

export const dataProvider = {
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
    console.log("getList URL:", url);

    return httpClient(url).then(({ json }) => {
      console.log("Response from server:", json);
      return {
        data: json.data,
        total: json.total,
      };
    });
  },

  getOne: (resource: string, params: any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: json,
    })),

  createFormData: (resource: string, params: any) => {
    const formData = new FormData();

    console.log("Создание FormData с данными:", params.data);

    for (const key in params.data) {
      if (params.data.hasOwnProperty(key)) {
        const value = params.data[key];

        if (key === "images" && Array.isArray(value)) {
          // Специальная обработка для изображений
          value.forEach((file: any, index: number) => {
            if (file && file.rawFile) {
              // Это новый загруженный файл
              console.log(`Добавляем файл изображения ${index}:`, file.rawFile);
              formData.append(`images`, file.rawFile);
            } else if (file && typeof file === "string") {
              // Это уже существующий URL изображения
              formData.append(`images[${index}]`, file);
            }
          });
        } else if (Array.isArray(value)) {
          // Обработка других массивов
          value.forEach((item: any, index: number) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      }
    }

    console.log("FormData содержимое:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Для FormData не устанавливаем Content-Type заголовок
    const options: any = {
      method: "POST",
      body: formData,
    };

    // Убираем Content-Type из заголовков для FormData
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
      .then((json) => ({
        data: { ...params.data, id: json.id },
      }));
  },

  create: (resource: string, params: any) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    })),

  update: (resource: string, params: any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

  delete: (resource: string, params: any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json })),
};
