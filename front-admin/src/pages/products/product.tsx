import { useState, useEffect } from "react";
import { Create, Datagrid, Edit, ImageField, ImageInput, List, TextInput,  Show, SimpleForm, TextField, AutocompleteInput, useDataProvider, EditProps, SelectArrayInput, SimpleShowLayout, ArrayField, CreateProps, SimpleList, DeleteButton, required, BooleanField, BooleanInput } from "react-admin";
import { productNameValidationFormat, productPriceValidationFormat } from "../../validations/validation";

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
            <BooleanField label="Чи є товар топовим у продажу" source="topSale"/>
            <TextField label="Знижка" source="discount"/>
            <ArrayField label="Фотографії" source="images">
                <SimpleList primaryText={(record) => (
                    <img key={record.url} src={record.url} alt="Фотографія" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                )} />
            </ArrayField>
            <DeleteButton />
        </Datagrid>
    </List>
);

export const ProductEdit = () => (
    <Edit
        transform={(data) => {
            console.log("Данные перед отправкой на сервер:", data);
            return {
                ...data,
                topSale: data.topSale === true ? 1 : 0, // Отправляем 1 или 0
            };
        }}
        mutationMode="pessimistic"
    >
        <SimpleForm>
            <TextInput label="Назва товару" source="name" validate={[required("Некоректна назва товару"), productNameValidationFormat]}/>
            <TextInput label="Ціна товару" source="price" validate={[required("Некоректна ціна"), productPriceValidationFormat]}/>
            <TextInput label="Опис товару" source="description" validate={required("Опис товару не може містити пусте поле")}/>
            <TextInput label="Знижка на товар у відсотках " source="discount"/>
            <BooleanInput label="Чи є товар топовим у продажу" source="topSale"  defaultValue={true}/>
            {/* Добавляем поле для редактирования изображений */}
            <ImageInput label="Фотографії товару" source="images" multiple accept={{ 'image/*': [] }}>
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Edit>
);

export const ProductShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="Ідентифікатор" />
            <TextField  source="name" label="Назва товару" />
            <TextField label="Ціна товару" source="price" />
            <TextField label="Опис товару" source="description" />
            <TextField label="Знижка на товар" source="discount"/>
            <TextField label="Нова ціна товару згідно знижки" source="newPrice"/>
            <BooleanField label="Чи є товар топовим у продажу" source="topSale"/>
            <ArrayField label="Фотографії" source="images">
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <SimpleList primaryText={(record) => (
                        <img key={record.url } src={record.url} alt="Фотографія" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                    )} />
                </div>
            </ArrayField>
            <ArrayField label="Схожі товари" source="similarProducts">
                <SimpleList
                    primaryText={(record) => record.name}
                    secondaryText={(record) => (
                        <img
                            src={record.images?.[0]?.url}
                            alt="Фотографія"
                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                        />
                    )}
                />
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
        <Create
            {...props}
            transform={(data) => {
                // Перетворення даних перед відправкою
                console.log("Дані форми перед перетворенням:", data);
                
                const transformedData = {
                    ...data,
                    // Перетворюємо topSale в числове значення якщо потрібно
                    topSale: data.topSale ? 1 : 0,
                };
                
                console.log("Перетворені дані:", transformedData);
                return transformedData;
            }}
            save={async (values: any) => {
                try {
                    // Логирование данных перед отправкой
                    console.log("Данные формы перед отправкой:", values);
                    console.log("Изображения:", values.images);

                    const productResponse = await dataProvider.createFormData("products", {
                        data: values,
                    });

                    console.log("Ответ после создания продукта:", productResponse);

                    const productId = productResponse.data.id;

                    if (values.similarProducts && values.similarProducts.length > 0) {
                        for (const similarProductId of values.similarProducts) {
                            await dataProvider.create("product_similar", {
                                data: {
                                    product_id: productId,
                                    similar_product_id: similarProductId,
                                },
                            });
                        }
                    }

                    return productResponse;
                } catch (error) {
                    console.error("Error creating product:", error);
                    throw error;
                }
            }}
            redirect="list"
        >
            <SimpleForm>
                <TextInput label="Назва товару" source="name" validate={[required("Некоректна назва товару"), productNameValidationFormat]}/>
                <TextInput label="Ціна товару" source="price" validate={[required("Некоректна ціна"), productPriceValidationFormat]}/>
                <TextInput label="Опис товару" source="description" validate={required("Опис товару не може містити пусте поле")}/>
                <TextInput label="Знижка на товар у відсотках " source="discount"/>
                <BooleanInput label="Чи є товар топовим у продажу" source="topSale"/>
                
                {/* Исправленный ImageInput */}
                <ImageInput 
                    label="Фотографії товару" 
                    source="images" 
                    multiple 
                    accept={{ 'image/*': [] }}
                    options={{ onDropRejected: (files) => console.log('Rejected files:', files) }}
                >
                    <ImageField source="src" title="title" />
                </ImageInput>
                
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