import { Create, Datagrid, Edit, ImageField, ImageInput, List, TextInput, SelectInput, Show, SimpleForm, TextField, AutocompleteInput } from "react-admin";
// Родительский компонент, который получает данные
const productFilters = [
    <TextInput
        label="Пошук"
        source="q"
        alwaysOn
        parse={value => value}
    />
];

export const ProductList = () => (
    <List filters={productFilters}>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="price" />
            <TextField source="description" />
            <ImageField source="images" />
        </Datagrid>
    </List>
);

export const ProductEdit = () => (
            <Edit>
                <SimpleForm>
                    <TextInput source="name" />
                    <TextInput source="price" />
                    <TextInput source="description" />
                    <ImageInput source="images" multiple />
                    <SelectInput  // выбор похожих товаров из выпадающего списка
                        source="similarProducts"
                        label="Похожие товары"
                        // choices={productChoices} //список товаров
                        optionValue="id"
                        multiline
                        // filter={(value, choice) => choice.id.toString().includes(value)} //фильтр
                    />
                </SimpleForm>
            </Edit>
);

export const ProductShow = () => (
    <Show>
        <SimpleForm>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="price" />
            <TextField source="description" />
            <ImageField source="images" />
        </SimpleForm>
    </Show>
);

export const ProductCreate = () => (
            <Create redirect="create">
                <SimpleForm>
                    <TextInput source="name" />
                    <TextInput source="price" />
                    <TextInput source="description" />
                    <ImageInput source="images" multiple />
                    <AutocompleteInput // выбор похожих товаров из выпадающего списка
                        source="similarProducts"
                        label="Похожие товары"
                        // choices={productChoices} //список товаров
                        optionValue="id"
                        // filter={(value, choice) => choice.id.toString().includes(value)} //фильтр
                        multiple
                    />
                </SimpleForm>
            </Create>

);