import { useState, useEffect } from "react";
import {
  Create,
  Datagrid,
  Edit,
  ImageField,
  ImageInput,
  List,
  TextInput,
  NumberInput,
  Show,
  SimpleForm,
  TextField,
  NumberField,
  useDataProvider,
  SelectArrayInput,
  SimpleShowLayout,
  ArrayField,
  CreateProps,
  SimpleList,
  DeleteButton,
  required,
  BooleanField,
  BooleanInput,
  EditButton,
} from "react-admin";
import {
  productNameValidationFormat,
  productPriceValidationFormat,
  discountValidation,
} from "../../validations/validation";

const productFilters = [
  <TextInput
    key="search"
    label="Пошук за назвою або описом"
    source="q"
    alwaysOn
  />,
];

export const ProductList = () => (
  <List filters={productFilters}>
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <TextField source="name" label="Назва" />
      <NumberField source="price" label="Ціна" options={{ style: "currency", currency: "UAH" }} />
      <NumberField source="newPrice" label="Ціна зі знижкою" options={{ style: "currency", currency: "UAH" }} />
      <TextField source="description" label="Опис" />
      <BooleanField source="topSale" label="Топ продаж" />
      <NumberField source="discount" label="Знижка (%)" />
      <ArrayField source="images" label="Фото">
        <SimpleList
          primaryText={(record) => (
            <img
              src={record.url}
              alt="Фото"
              style={{ maxWidth: "80px", maxHeight: "80px", objectFit: "cover" }}
            />
          )}
        />
      </ArrayField>
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const ProductShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Назва" />
      <NumberField source="price" label="Ціна" options={{ style: "currency", currency: "UAH" }} />
      <NumberField source="discount" label="Знижка (%)" />
      <NumberField source="newPrice" label="Ціна зі знижкою" options={{ style: "currency", currency: "UAH" }} />
      <TextField source="description" label="Опис" />
      <BooleanField source="topSale" label="Топ продаж" />
      <ArrayField source="images" label="Фотографії">
        <SimpleList
          primaryText={(record) => (
            <img
              src={record.url}
              alt="Фото"
              style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
            />
          )}
        />
      </ArrayField>
      <ArrayField source="similarProducts" label="Схожі товари">
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) => (
            <img
              src={record.images?.[0]?.url}
              alt="Фото"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          )}
        />
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export const ProductEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm>
      <TextInput
        source="name"
        label="Назва"
        validate={[required("Назва обов'язкова"), productNameValidationFormat]}
      />
      <NumberInput
        source="price"
        label="Ціна"
        validate={[required("Ціна обов'язкова"), productPriceValidationFormat]}
      />
      <NumberInput
        source="discount"
        label="Знижка (%)"
        validate={discountValidation}
      />
      <TextInput
        source="description"
        label="Опис"
        multiline
        validate={required("Опис обов'язковий")}
      />
      <BooleanInput source="topSale" label="Топ продаж" />
      <ImageInput
        source="images"
        label="Фотографії"
        multiple
        accept={{ "image/*": [] }}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);

export const ProductCreate = (props: CreateProps) => {
  const dataProvider = useDataProvider();
  const [productChoices, setProductChoices] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    dataProvider
      .getList("products", {
        pagination: { page: 1, perPage: 100 },
        sort: { field: "name", order: "ASC" },
        filter: {},
      })
      .then(({ data }) => {
        setProductChoices(data);
      });
  }, [dataProvider]);

  return (
    <Create
      {...props}
      transform={(data) => ({
        ...data,
        topSale: Boolean(data.topSale),
        similarProductIds: data.similarProducts || [],
        similarProducts: undefined,
      })}
      redirect="list"
      mutationMode="pessimistic"
    >
      <SimpleForm>
        <TextInput
          source="name"
          label="Назва"
          validate={[required("Назва обов'язкова"), productNameValidationFormat]}
        />
        <NumberInput
          source="price"
          label="Ціна"
          validate={[required("Ціна обов'язкова"), productPriceValidationFormat]}
        />
        <NumberInput
          source="discount"
          label="Знижка (%)"
          validate={discountValidation}
        />
        <TextInput
          source="description"
          label="Опис"
          multiline
          validate={required("Опис обов'язковий")}
        />
        <BooleanInput source="topSale" label="Топ продаж" defaultValue={false} />
        <ImageInput
          source="images"
          label="Фотографії"
          multiple
          accept={{ "image/*": [] }}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
        <SelectArrayInput
          source="similarProducts"
          label="Схожі товари"
          choices={productChoices}
          optionValue="id"
          optionText="name"
        />
      </SimpleForm>
    </Create>
  );
};