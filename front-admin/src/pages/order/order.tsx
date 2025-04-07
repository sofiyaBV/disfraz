import { List, Datagrid, Edit, SimpleForm, Show, DateField, TextField, TextInput } from "react-admin";


export const OrderList = () => (
    <List >
        <Datagrid >
            <TextField source="id" />
            <DateField source="createdAt" />
            <TextField source="customerName" />
            <TextField source="notes" />
            <TextField source="status" />
        </Datagrid>
    </List>
);

export const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <TextField source="id" />
            <DateField source="createdAt" />
            <TextField source="customerName" />
            <TextField source="notes" />
            <TextInput source="status" />
        </SimpleForm>
    </Edit>
);

export const OrderShow = () => (
    <Show>
        <SimpleForm>
        <TextField source="id" />
            <DateField source="createdAt" />
            <TextField source="customerName" />
            <TextField source="customerEmail" />
            <TextField source="customerPhone" />
            <TextField source="deliveryAddress" />
            <TextField source="notes" />
            <TextField source="status" />
        </SimpleForm>
    </Show>
);

