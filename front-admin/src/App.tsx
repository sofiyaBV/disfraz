import {
  Admin,
  Resource,
} from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { UserCreate, UserEdit, UserList, UserShow } from "./pages/users/users";
import {authProvider} from "./authProvider.ts";
import { ProductCreate, ProductEdit, ProductList, ProductShow } from "./pages/products/product.tsx";


export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider} authProvider={authProvider}>
        <Resource name="user" list={UserList} edit={UserEdit} show={UserShow} create={UserCreate} />
        <Resource name="products" list={ProductList} edit={ProductEdit} show={ProductShow} create={ProductCreate}  />

  </Admin>
  
);
