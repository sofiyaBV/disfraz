import {
  Admin,
  EditGuesser,
  Resource,
  ShowGuesser,
} from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";

// import { authProvider } from "./authProvider";
import { UserList } from "./lists/users";

export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={dataProvider}
    // authProvider={authProvider}
  >
    <Resource
      name="admin"
      list={UserList}
      edit={EditGuesser}
      show={ShowGuesser}
    />
  </Admin>
  
);
