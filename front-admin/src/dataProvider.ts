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

// Функция для проверки наличия файлов в данных
const hasFiles = (data: any): boolean => {
  if (!data || typeof data !== "object") return false;

  // Проверяем images
  if (data.images && Array.isArray(data.images)) {
    return data.images.some((item: any) => item && item.rawFile);
  }

  // Можно добавить проверку других полей с файлами
  return false;
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
      .then((json) => {
        console.log("Ответ сервера после создания:", json);
        return {
          data: json, // Возвращаем данные от сервера, а не оригинальные данные формы
        };
      });
  },

  // Модифицируем create для автоматического выбора метода
  create: (resource: string, params: any) => {
    console.log(
      "Create called for resource:",
      resource,
      "with params:",
      params,
    );

    // Для продуктов проверяем наличие файлов
    if (resource === "products" && hasFiles(params.data)) {
      console.log("Detected files in product data, using createFormData");
      return dataProvider.createFormData(resource, params);
    }

    // Для остальных случаев используем обычный JSON
    console.log("Using standard JSON create");
    return httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    }));
  },

  // Аналогично для update
  updateFormData: (resource: string, params: any) => {
    const formData = new FormData();

    console.log("Обновление FormData с данными:", params.data);

    for (const key in params.data) {
      if (params.data.hasOwnProperty(key)) {
        const value = params.data[key];

        if (key === "images" && Array.isArray(value)) {
          // Специальная обработка для изображений
          value.forEach((file: any, index: number) => {
            if (file && file.rawFile) {
              // Это новый загруженный файл
              console.log(
                `Добавляем файл изображения ${index} для обновления:`,
                file.rawFile,
              );
              formData.append(`images`, file.rawFile);
            } else if (file && (typeof file === "string" || file.url)) {
              // Это уже существующий URL изображения
              const imageUrl = typeof file === "string" ? file : file.url;
              formData.append(`images[${index}]`, imageUrl);
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

    console.log("FormData содержимое для обновления:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
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
        console.log("Ответ сервера после обновления:", json);
        return {
          data: json,
        };
      });
  },

  update: (resource: string, params: any) => {
    console.log(
      "Update called for resource:",
      resource,
      "with params:",
      params,
    );

    // Для продуктов проверяем наличие файлов
    if (resource === "products" && hasFiles(params.data)) {
      console.log("Detected files in product data, using updateFormData");
      return dataProvider.updateFormData(resource, params);
    }

    // Для остальных случаев используем обычный JSON
    console.log("Using standard JSON update");
    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  delete: (resource: string, params: any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json })),
};
