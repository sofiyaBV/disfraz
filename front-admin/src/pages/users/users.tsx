import { Create, Datagrid, Edit, EditButton, EmailField, List, Show, SimpleForm, TextField, TextInput } from "react-admin";

const userFilters = [
    <TextInput source="q" label="Search" alwaysOn />,//Поле для поиска
]

export const UserList = () => (
    <List filters={userFilters}>
        <Datagrid rowClick = "show">
            <TextField source="id" />
            <EmailField source="email" />
            <TextField source="phone" />
            <EditButton />
        </Datagrid>
    </List>
);

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="username" />
            <TextInput source="email" />
            <TextInput source="phone" />
        </SimpleForm>
    </Edit>
);

export const UserShow = () => (
    <Show>
        <SimpleForm>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="username" />
            <EmailField source="email" />
            <TextField source="phone" />
        </SimpleForm>
    </Show>
);

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="email" />
            <TextInput source="password" />
        </SimpleForm>
    </Create>
);
