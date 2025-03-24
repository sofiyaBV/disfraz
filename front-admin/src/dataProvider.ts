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
    console.log("Authorization header set:", `Bearer ${token}`);
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
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    console.log("getList URL:", url);

    return httpClient(url).then(({json }) => {
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

        /////////////////////////////
      // getMany: (resource: string, params: any) => {
      //     const query = {
      //         filter: JSON.stringify({ id: params.ids }),
      //     };
      //     const url = `${apiUrl}/${resource}?${stringify(query)}`;
      //     return httpClient(url).then(({ json }) => ({ data: json }));
      // },
  
      // getManyReference: (resource: string, params: any) => {
      //     const { target, id } = params;
      //     const query = {
      //         filter: JSON.stringify({ [target]: id }),
      //     };
      //     const url = `${apiUrl}/${resource}?${stringify(query)}`;
      //     return httpClient(url).then(({ json }) => ({ data: json, total: json.length }));
      // },
  
      // updateMany: (resource: string, params: any) => {
      //     return Promise.all(
      //         params.ids.map((id: any) =>
      //             httpClient(`${apiUrl}/${resource}/${id}`, {
      //                 method: "PATCH",
      //                 body: JSON.stringify(params.data),
      //             }).then(({ json }) => json)
      //         )
      //     ).then(responses => ({ data: responses }));
      // },
  
      // deleteMany: (resource: string, params: any) => {
      //     return Promise.all(
      //         params.ids.map((id: any) =>
      //             httpClient(`${apiUrl}/${resource}/${id}`, {
      //                 method: "DELETE",
      //             }).then(({ json }) => json)
      //         )
      //     ).then(responses => ({ data: responses }));
      // },
      };