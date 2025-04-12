import { Create, Datagrid, DateField, Edit, EditButton, EmailField, List, PasswordInput, required, Show, SimpleForm, SimpleShowLayout, TextField, TextInput } from "react-admin";
import { emailValidationFormat, phoneValidationFormat } from "../../validations/validation";

const userFilters = [
    <TextInput source="q" label="Пошук за поштою" alwaysOn />
]

export const UserList = () => (
    <List filters={userFilters}>
        <Datagrid rowClick = "show">
            <TextField source="id" />
            <EmailField label="Пошта" source="email" />
            <TextField label="Роль" source="roles" />
            <EditButton />
        </Datagrid>
    </List>
);

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
        <TextInput
                label="Пошта"
                source="email"
                validate={[required("Пошта обов'язкова"), emailValidationFormat]}
            />
        <TextInput
            label="Номер телефону"
            source="phone"
            validate={[phoneValidationFormat]}
        />
        </SimpleForm>
    </Edit>
);

export const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="Ідентифікатор" />
            <EmailField source="email" label="Електронна пошта" />
            <TextField source="phone" label="Номер телефону" />
            <DateField source="createdAt" label="Дата створення" showTime />
            <DateField source="updatedAt" label="Дата оновлення" showTime />
            <TextField source="roles" label="Роль" />
        </SimpleShowLayout>
    </Show>
);

export const UserCreate = () => (
    <Create redirect="list">
        <SimpleForm>
        <TextInput
                label="Пошта"
                source="email"
                validate={[required("Пошта обов'язкова"), emailValidationFormat]}
            />
        <PasswordInput
            label="Пароль"
            source="password"
            validate={[required('Пароль обов\'язковий')]}
        />
        </SimpleForm>
    </Create>
);


