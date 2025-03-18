import jsonServerProvider from "ra-data-json-server";//Импорт провайдера данных для json-serve rкоторый сопоставляет запросы с JSONPlaceholder API с API react-admin API

export const dataProvider = jsonServerProvider(//Создание провайдера данных для json-server
  import.meta.env.VITE_JSON_SERVER_URL,//Стандартный URL для json-server JSONPlaceholder  
);
