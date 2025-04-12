import {
  Admin,
  Resource,
} from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { UserCreate, UserEdit, UserList, UserShow } from "./pages/users/users";
import {authProvider} from "./authProvider.ts";
import { ProductCreate, ProductEdit, ProductList, ProductShow } from "./pages/products/product.tsx";
import { AttributeCreate, AttributeEdit, AttributeList, AttributeShow } from "./pages/attribute/attribute.tsx";
import { OrderList, OrderEdit, OrderShow } from "./pages/order/order.tsx";
import { CommentList, CommentEdit, CommentShow } from "./pages/comment/comment.tsx";
import { ProductAttributeList, ProductAttributeEdit, ProductAttributeShow, ProductAttributeCreate } from "./pages/product_attribute/product-attribute.tsx";


export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider} authProvider={authProvider}>
        <Resource name="user" list={UserList} edit={UserEdit} show={UserShow} create={UserCreate} options={{label:"Користувачі"}}/>
        <Resource name="products" list={ProductList} edit={ProductEdit} show={ProductShow} create={ProductCreate}  options={{label:"Продукти"}}/>
        <Resource name="attributes" list={AttributeList} edit={AttributeEdit} show={AttributeShow} create={AttributeCreate} options={{label:"Атрибути"}} />
        <Resource name="comments" list={CommentList} edit={CommentEdit} show={CommentShow} options={{label:"Усі коментарі"}} />
        <Resource name="orders" list={OrderList} edit={OrderEdit} show={OrderShow} options={{label:"Усі замовлення"}}/>
        <Resource name="product-attribute" list={ProductAttributeList} edit={ProductAttributeEdit} show={ProductAttributeShow} create={ProductAttributeCreate} options={{label:"Товари"}}/>
  </Admin>
  
);
