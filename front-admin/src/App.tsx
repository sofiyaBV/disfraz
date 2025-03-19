import {
  Admin,
  EditGuesser,
  Resource,
  ShowGuesser,
} from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { UserCreate, UserEdit, UserList, UserShow } from "./pages/users/users";
import {authProvider} from "./authProvider.ts";


export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider} authProvider={authProvider}>
        <Resource name="user" list={UserList} edit={UserEdit} show={UserShow} create={UserCreate} />

  </Admin>
  
);
