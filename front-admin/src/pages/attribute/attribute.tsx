import { useEffect, useState } from "react";
import { List, Datagrid, Create, Edit, EditButton, Show, SimpleForm, TextField, TextInput, BooleanField, NumberField, SimpleShowLayout, BooleanInput, NumberInput, EditProps, useDataProvider, SelectArrayInput, ArrayField, ImageField, DeleteButton, CreateProps } from "react-admin";

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
            <TextField source="name" label="Назва" />
            <TextField source="theme" label="Тема" />
            <TextField source="bodyPart" label="Частина тіла" />
            <BooleanField source="isSet" label="Набір" />
            <TextField source="inStock" label="В наявності" />
            <NumberField source="valueNumber" label="Числове значення" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const AttributeEdit = (props: EditProps) => {
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
                <TextInput source="name" label="Назва" />
                <TextInput source="material" label="Матеріал" />
                <TextInput source="size" label="Розмір" />
                <TextInput source="theme" label="Тема" />
                <TextInput source="bodyPart" label="Частина тіла" />
                <BooleanInput source="isSet" label="Набір" />
                <TextInput source="additiomalInfo" label="Додаткова інформація" />
                <TextInput source="inStock" label="В наявності" />
                <TextInput source="valueText" label="Текстове значення" />
                <NumberInput source="valueNumber" label="Числове значення" />

                {/* добавлення схожих товарів, пов'язаних через таблицю */}
                {/* <SelectArrayInput
                    source="productIds"
                    label="Пов'язані товари"
                    choices={productChoices}
                    optionValue="id"
                    filter="name"
                /> */}
            </SimpleForm>
        </Edit>
    );
};

// export const AttributeEdit = () => (
//     <Edit>
//         <SimpleForm>
//             <TextInput source="name" label="Назва" />
//             <TextInput source="material" label="Матеріал" />
//             <TextInput source="size" label="Розмір" />
//             <TextInput source="theme" label="Тема" />
//             <TextInput source="bodyPart" label="Частина тіла" />
//             <BooleanInput source="isSet" label="Набір" />
//             <TextInput source="additiomalInfo" label="Додаткова інформація" />
//             <TextInput source="inStock" label="В наявності" />
//             <TextInput source="valueText" label="Текстове значення" />
//             <NumberInput source="valueNumber" label="Числове значення" />

//         </SimpleForm>
//     </Edit>
// );


export const AttributeShow = (props: EditProps) => {
    const dataProvider = useDataProvider();
    const [relatedProducts, setRelatedProducts] = useState<{ id: string; name: string; images: string[] }[]>([]);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            const { id } = props; // Получаем ID текущего атрибута
            if (id) {
                const { data } = await dataProvider.getList('product_attribute', {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'name', order: 'ASC' },
                    filter: { attributeId: id }, // Фильтруем по ID атрибута
                });
                setRelatedProducts(data);
            }
        };

        fetchRelatedProducts();
    }, [dataProvider, props]);

    return (
        <Show {...props}>
            <SimpleShowLayout>
                <TextField source="id" label="ID" />
                <TextField source="name" label="Назва" />
                <TextField source="material" label="Матеріал" />
                <TextField source="size" label="Розмір" />
                <TextField source="theme" label="Тема" />
                <TextField source="bodyPart" label="Частина тіла" />
                <BooleanField source="isSet" label="Набір" />
                <TextField source="additiomalInfo" label="Додаткова інформація" />
                <TextField source="inStock" label="В наявності" />
                <TextField source="valueText" label="Текстове значення" />
                <NumberField source="valueNumber" label="Числове значення" />

                {/* Пов'язані товари */}
                <ArrayField label="Пов'язані товари" source="productId">
                    <Datagrid>
                        {relatedProducts.map((product) => (
                            <Datagrid key={product.id}>
                                {/* <TextField source="name" label="Назва товару" />
                                <ImageField source="images" label="Фотографії" /> */}
                                <NumberField source="id" label="ID" />
                            </Datagrid>
                        ))}
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    );
};

export const AttributeCreate = () => (
        <Create redirect="list" >
            <SimpleForm>
                <TextInput source="name" label="Назва" />
                <TextInput source="material" label="Матеріал" />
                <TextInput source="size" label="Розмір" />
                <TextInput source="theme" label="Тема" />
                <TextInput source="bodyPart" label="Частина тіла" />
                <BooleanInput source="isSet" label="Набір" />
                <TextInput source="additiomalInfo" label="Додаткова інформація" />
                <TextInput source="inStock" label="В наявності" />
                <TextInput source="valueText" label="Текстове значення" />
                <NumberInput source="valueNumber" label="Числове значення" />

                {/* добавлення схожих товарів, пов'язаних через таблицю */}
            </SimpleForm>
        </Create>
);

