import {
  Admin,
  Resource,
} from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { UserCreate, UserEdit, UserList, UserShow } from "./pages/users/users";


export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider}>
        <Resource name="users" list={UserList} edit={UserEdit} show={UserShow} create={UserCreate} />//Создание ресурса users и вывод его в виде списка

  </Admin>
  
);
