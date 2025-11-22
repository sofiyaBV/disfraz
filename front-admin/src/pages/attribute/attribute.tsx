import {
  List,
  Datagrid,
  Create,
  Edit,
  Show,
  SimpleForm,
  TextField,
  TextInput,
  BooleanField,
  SimpleShowLayout,
  BooleanInput,
  DeleteButton,
  EditButton,
  required,
  minLength,
  SelectInput,
} from "react-admin";

const BODY_PART_CHOICES = [
  { id: "голова", name: "Голова" },
  { id: "шия", name: "Шия" },
  { id: "плечі", name: "Плечі" },
  { id: "руки", name: "Руки" },
  { id: "тулуб", name: "Тулуб" },
  { id: "ноги", name: "Ноги" },
  { id: "стопи", name: "Стопи" },
  { id: "все тіло", name: "Все тіло" },
];

const attributeFilters = [
  <TextInput
    key="search"
    label="Пошук"
    source="q"
    alwaysOn
  />,
];

export const AttributeList = () => (
  <List filters={attributeFilters}>
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <TextField source="material" label="Матеріал" />
      <TextField source="size" label="Розмір" />
      <TextField source="theme" label="Тема" />
      <TextField source="bodyPart" label="Частина тіла" />
      <BooleanField source="isSet" label="Набір" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const AttributeShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="material" label="Матеріал" />
      <TextField source="size" label="Розмір" />
      <TextField source="theme" label="Тема" />
      <TextField source="bodyPart" label="Частина тіла" />
      <BooleanField source="isSet" label="Набір" />
      <TextField source="description" label="Опис" />
    </SimpleShowLayout>
  </Show>
);

export const AttributeEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput
        source="material"
        label="Матеріал"
        validate={[required(), minLength(4)]}
      />
      <TextInput source="size" label="Розмір" validate={required()} />
      <TextInput
        source="theme"
        label="Тема"
        validate={[required(), minLength(3)]}
      />
      <SelectInput
        source="bodyPart"
        label="Частина тіла"
        choices={BODY_PART_CHOICES}
        validate={required()}
      />
      <BooleanInput source="isSet" label="Набір" />
      <TextInput source="description" label="Опис" multiline />
    </SimpleForm>
  </Edit>
);

export const AttributeCreate = () => (
  <Create redirect="list">
    <SimpleForm>
      <TextInput
        source="material"
        label="Матеріал"
        validate={[required(), minLength(4)]}
      />
      <TextInput source="size" label="Розмір" validate={required()} />
      <TextInput
        source="theme"
        label="Тема"
        validate={[required(), minLength(3)]}
      />
      <SelectInput
        source="bodyPart"
        label="Частина тіла"
        choices={BODY_PART_CHOICES}
        validate={required()}
      />
      <BooleanInput source="isSet" label="Набір" />
      <TextInput source="description" label="Опис" multiline />
    </SimpleForm>
  </Create>
);