import { List, Datagrid, Create, Edit, EditButton, Show, SimpleForm, TextField, TextInput, BooleanField, SimpleShowLayout, BooleanInput, DeleteButton, required, minLength, SelectInput } from "react-admin";

const attributeFilters = [
    <TextInput
        label="Пошук за назваою, тематикою, частино. тіла або наявністю"
        source="q"
        alwaysOn
        parse={value => value}
    />
];

export const AttributeList = () => (
    <List filters={attributeFilters}>
        <Datagrid rowClick="show">
            <TextField source="id" label="ID" />
            <TextField source="theme" label="Тема" />
            <TextField source="bodyPart" label="Частина тіла" />
            <BooleanField source="isSet" label="Набір" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const AttributeEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput
                source="material"
                label="Матеріал"
                validate={[required(), minLength(4)]}
            />
            <TextInput source="size" label="Розмір" validate={[required()]} />
            <TextInput
                source="theme"
                label="Тема"
                validate={[required(), minLength(3)]}
            />
            <SelectInput
                source="bodyPart"
                label="Частина тіла"
                choices={[
                    { id: 'голова', name: 'Голова' },
                    { id: 'шия', name: 'Шия' },
                    { id: 'плечі', name: 'Плечі' },
                    { id: 'руки', name: 'Руки' },
                    { id: 'тулуб', name: 'Тулуб' },
                    { id: 'ноги', name: 'Ноги' },
                    { id: 'стопи', name: 'Стопи' },
                    { id: 'все тіло', name: 'Все тіло' },
                ]}
                validate={[required()]}
            />
            <BooleanInput source="isSet" label="Набір" />
            <TextInput source="description" label="Додаткова інформація" />
        </SimpleForm>
    </Edit>
);

export const AttributeShow = () => (
        <Show >
            <SimpleShowLayout>
                <TextField source="id" label="ID" />
                <TextField source="material" label="Матеріал" />
                <TextField source="size" label="Розмір" />
                <TextField source="theme" label="Тема" />
                <TextField source="bodyPart" label="Частина тіла" />
                <BooleanField source="isSet" label="Набір" />
                <TextField source="description" label="Додаткова інформація" />
            </SimpleShowLayout>
        </Show>
);

export const AttributeCreate = () => (
    <Create redirect="list">
        <SimpleForm>
            <TextInput
                source="material"
                label="Матеріал"
                validate={[required(), minLength(4)]}
            />
            <TextInput source="size" label="Розмір" validate={[required()]} />
            <TextInput
                source="theme"
                label="Тема"
                validate={[required(), minLength(3)]}
            />
            <SelectInput
                source="bodyPart"
                label="Частина тіла"
                choices={[
                    { id: 'голова', name: 'Голова' },
                    { id: 'шия', name: 'Шия' },
                    { id: 'плечі', name: 'Плечі' },
                    { id: 'руки', name: 'Руки' },
                    { id: 'тулуб', name: 'Тулуб' },
                    { id: 'ноги', name: 'Ноги' },
                    { id: 'стопи', name: 'Стопи' },
                    { id: 'все тіло', name: 'Все тіло' },
                ]}
                validate={[required()]}
            />            <BooleanInput source="isSet" label="Набір" />
            <TextInput source="description" label="Додаткова інформація" />
        </SimpleForm>
    </Create>
);

