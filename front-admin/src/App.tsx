import {
  Admin,
  Resource
} from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { UserCreate, UserEdit, UserList, UserShow } from "./lists/users";
import authProvider from "./authProvider";
// import { authProvider } from "./authProvider";
// import { UserList } from "./lists/users";

export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
    <Resource
      name="users"
      list={UserList}
      edit={UserEdit}
      show={UserShow}
      create={UserCreate}
    />
  </Admin>
);
