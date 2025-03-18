import {
List,
Datagrid,
TextField,
EmailField,
DateField,
Show,
SimpleShowLayout,
useShowController,
Edit,
SimpleForm,
TextInput,
required,
regex,
minLength,
SelectInput,
Create,
PasswordInput,
} from "react-admin";
import { DeleteButton } from 'react-admin'; // Импортируем стандартную кнопку удаления

export const UserList = () => {
    return (
    <List>
        <Datagrid>
        <TextField source="id" />
        <EmailField source="email" />
        <TextField source="phone" />
        <DateField source="created_at" />
        <DateField source="updated_at" />
        </Datagrid>
    </List>
    );
};

export const UserCreate = () => {
    return (
    <Create>
        <SimpleForm>
        <TextInput
            source="email"
            validate={[required(), regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Некоректний формат email')]}
        />
        <TextInput
            source="phone"
            validate={[required(), minLength(8), regex(/^[0-9]+$/, 'Некоректний формат номеру(мінімум 8 цифр)')]}
        />
        <PasswordInput source="password" validate={[required(), minLength(6)]} label="Пароль" />
        <SelectInput source="role" choices={[
            { id: 'admin', name: 'Admin' },
            { id: 'user', name: 'User' },
        ]} />
        </SimpleForm>
    </Create>
    );
};

export const UserEdit = () => {
    return (
    <Edit>
        <SimpleForm>
        <TextInput
            source="email"
            validate={[required(), regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Некорректный формат email')]}
        />
        <TextInput
            source="phone"
            validate={[required(), minLength(8), regex(/^[0-9]+$/, 'Номер телефона должен содержать только цифры и быть не менее 8 символов')]}
        />
        <SelectInput source="role" choices={[
            { id: 'admin', name: 'Admin' },
            { id: 'user', name: 'User' },
        ]} />
        </SimpleForm>
    </Edit>
    );
};

export const UserShow = () => {
    const { record, isLoading, error } = useShowController();

    if (isLoading) {
    return <div>Loading...</div>;
    }
    if (error) {
    return <div>Error loading user data.</div>;
    }
    if (!record) {
    return null;
    }

    return (
    <Show>
        <SimpleShowLayout>
        <TextField source="id" />
        <EmailField source="email" />
        <TextField source="phone" />
        <TextField source="role" />
        <DateField source="created_at" />
        <DateField source="updated_at" />

        <DeleteButton resource="users" record={record} />
        </SimpleShowLayout>
    </Show>
    );
};