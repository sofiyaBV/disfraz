import { List, Datagrid, Create, Edit, EditButton, Show, SimpleForm, TextField, TextInput, BooleanField, NumberField } from "react-admin";

export const AttributeList = () => (
    <List >
        <Datagrid rowClick = "show">
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="theme" />
            <BooleanField source="isSet" />
            <TextField source="isStock" />
            <NumberField source="valueNumber" />
            <EditButton />
        </Datagrid>
    </List>
);

export const AttributeEdit = () => (
    <Edit>
        <SimpleForm>
        <TextInput source="name" />
            <TextInput source="material" />
            <TextInput source="size" />
            <TextInput source="theme" />
            <TextInput source="bodyPart" />
            <BooleanField source="isSet" />
            <TextInput source="additiomalInfo" />
            <TextInput source="isStock" />
            <TextInput source="valueText" />
            <NumberField source="valueNumber" />
            //добавление похожих товаров связаных через таблицу
        </SimpleForm>
    </Edit>
);

export const AttributeShow = () => (
    <Show>
        <List>
        <TextField source="id" />
            <TextField source="name" />
            <TextField source="material" />
            <TextField source="size" />
            <TextField source="theme" />
            <TextField source="bodyPart" />
            <BooleanField source="isSet" />
            <TextField source="additiomalInfo" />
            <TextField source="isStock" />
            <TextField source="valueText" />
            <NumberField source="valueNumber" />
        </List>
    </Show>
);

export const AttributeCreate = () => (
    <Create redirect="list">
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="material" />
            <TextInput source="size" />
            <TextInput source="theme" />
            <TextInput source="bodyPart" />
            <BooleanField source="isSet" />
            <TextInput source="additiomalInfo" />
            <TextInput source="isStock" />
            <TextInput source="valueText" />
            <NumberField source="valueNumber" />
            //добавление похожих товаров связаных через таблицу
        </SimpleForm>
    </Create>
);