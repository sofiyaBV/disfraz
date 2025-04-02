import { Create, Datagrid, DateField, Edit, EditButton, EmailField, List, PasswordInput, required, Show, SimpleForm, SimpleShowLayout, TextField, TextInput } from "react-admin";

const userFilters = [
    <TextInput source="q" label="Search" alwaysOn />,//Поле для поиска
]

export const UserList = () => (
    <List filters={userFilters}>
        <Datagrid rowClick = "show">
            <TextField source="id" />
            <EmailField label="Пошта" source="email" />
            <TextField label="Номер телефону" source="phone" />
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
                validate={[
                    (value) =>
                        value && !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
                        ? 'Невірний формат пошти'
                        : undefined,
                ]}
            />

        <TextInput
            label="Номер телефону"
            source="phone"
            validate={[
                (value) =>
                value && value.length < 10 && value.length > 18
                    ? 'Номер телефону повинен містити від 10 до 18 символів'
                    : undefined,
                (value) =>
                value && !/^\+?[0-9]+$/.test(value)
                    ? 'Невірний формат номера телефону'
                    : undefined,
            ]}
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
                validate={[
                    required('Пошта обов\'язкова'),
                    (value) =>
                        value && !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
                        ? 'Невірний формат пошти'
                        : undefined,
                ]}
            />

        <TextInput
            label="Номер телефону"
            source="phone"
            validate={[
                (value) =>
                value && value.length < 10 && value.length > 18
                    ? 'Номер телефону повинен містити від 10 до 18 символів'
                    : undefined,
                (value) =>
                value && !/^\+?[0-9]+$/.test(value)
                    ? 'Невірний формат номера телефону'
                    : undefined,
            ]}
        />
        <PasswordInput
            source="password"
            validate={[required('Пароль обов\'язковий')]}
        />
        
        </SimpleForm>
    </Create>
);
