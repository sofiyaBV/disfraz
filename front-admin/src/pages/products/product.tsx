import { useState, useEffect } from "react";
import { Create, Datagrid, Edit, ImageField, ImageInput, List, TextInput,  Show, SimpleForm, TextField, AutocompleteInput, useDataProvider, EditProps, SelectArrayInput, SimpleShowLayout, ArrayField, CreateProps } from "react-admin";
// Родительский компонент, который получает данные
const productFilters = [
    <TextInput
        label="Пошук за назваою або описом"
        source="q"
        alwaysOn
        parse={value => value}
    />
];

export const ProductList = () => (
    <List filters={productFilters}>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField label="Назва товару" source="name" />
            <TextField label="Ціна" source="price" />
            <TextField label="Опис товару" source="description" />
            <ArrayField label="Фотографії" source="images">
                <Datagrid>
                    <ImageField label="Фотографії" source="url" />
                </Datagrid>
            </ArrayField>
        </Datagrid>
    </List>
);



export const ProductEdit = (props: EditProps) => {
    const dataProvider = useDataProvider();
    const [productChoices, setProductChoices] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        dataProvider.getList('products', {
            pagination: { page: 1, perPage: 100 }, // Получаем все товары
            sort: { field: 'name', order: 'ASC' },
            filter: {},
        }).then(({ data }) => {
            setProductChoices(data);
        });
    }, [dataProvider]);

    return (
        <Edit {...props}>
            <SimpleForm>
                <TextInput label="Назва товару" source="name" />
                <TextInput label="Ціна товару" source="price" />
                <TextInput label="Опис товару" source="description" />
                <ImageInput label="Фотографії товару" source="images" multiple />
                <SelectArrayInput
                    source="similarProducts"
                    label="Схожі товари"
                    choices={productChoices}
                    optionValue="id"
                    filter="name"
                />
            </SimpleForm>
        </Edit>
    );
};

export const ProductShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="Ідентифікатор" />
            <TextField  source="name" label="Назва товару" />
            <TextField label="Ціна товару" source="price" />
            <TextField label="Опис товару" source="description" />
            <ArrayField label="Фотографії" source="images">
                <Datagrid>
                    <ImageField label="Фотографії" source="url" />
                </Datagrid>
            </ArrayField>
            <ArrayField label="Схожі товари" source="similarProducts">
                <Datagrid>
                    <TextField source="name" label="Назва товару" />
                    <ImageField label="Фотографії" source="images" />
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);

export const ProductCreate = (props: CreateProps) => {
    const dataProvider = useDataProvider();
    const [productChoices, setProductChoices] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        dataProvider.getList('products', {
            pagination: { page: 1, perPage: 100 }, // Получаем все товары
            sort: { field: 'name', order: 'ASC' },
            filter: {},
        }).then(({ data }) => {
            setProductChoices(data);
        });
    }, [dataProvider]);

    return (
        <Create {...props} save={async (values: any) => {
            alert("Save in Create")
            return await dataProvider.createFormData("products", {
              data: values,
            });
        }}>
            <SimpleForm>
                <TextInput label="Назва товару" source="name" />
                <TextInput label="Ціна товару" source="price" />
                <TextInput label="Опис товару" source="description" />
                <ImageInput label="Фотогрвфії товару" source="images" multiple />
                <SelectArrayInput
                    source="similarProducts"
                    label="Схожі товари"
                    choices={productChoices}
                    optionValue="id"
                    filter="name"
                />
            </SimpleForm>
        </Create>
    );
};