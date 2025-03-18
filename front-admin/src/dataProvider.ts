
import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = import.meta.env.VITE_JSON_SERVER_URL;
const httpClient = fetchUtils.fetchJson;

export const dataProvider = {
    getList: (resource: any, params: { pagination: { page: any; perPage: any; }; sort: { field: any; order: any; }; filter: any; }) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        console.log("url => " + url)

        return httpClient(url).then(({ json }) =>
            ({
            data: json.data,
            total: json.total,
        }));
    },
    // other methods (getOne, getMany, etc.) should be implemented similarly

    getOne: (resource: any, params: { id: any; }) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    create: (resource: any, params: { data: any; }) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id },
        })),

};


// import jsonServerProvider from "ra-data-json-server";
//
// export const dataProvider = jsonServerProvider(
//   import.meta.env.VITE_JSON_SERVER_URL,
// );
