import {
  List,
  Datagrid,
  Edit,
  Show,
  SimpleForm,
  TextField,
  NumberField,
  DateField,
  SimpleShowLayout,
  SelectInput,
  required,
} from "react-admin";

const ORDER_STATUS_CHOICES = [
  { id: "Pending", name: "Очікується" },
  { id: "Processing", name: "Обробляється" },
  { id: "Completed", name: "Завершено" },
  { id: "Cancelled", name: "Скасовано" },
];

export const OrderList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <DateField source="createdAt" label="Дата" showTime />
      <TextField source="customerName" label="Клієнт" />
      <NumberField source="price" label="Сума" options={{ style: "currency", currency: "UAH" }} />
      <NumberField source="quantity" label="Кількість" />
      <TextField source="status" label="Статус" />
    </Datagrid>
  </List>
);

export const OrderShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <DateField source="createdAt" label="Дата створення" showTime />
      <TextField source="customerName" label="Ім'я клієнта" />
      <TextField source="customerEmail" label="Email" />
      <TextField source="customerPhone" label="Телефон" />
      <TextField source="deliveryAddress" label="Адреса доставки" />
      <TextField source="notes" label="Примітки" />
      <NumberField source="price" label="Сума" options={{ style: "currency", currency: "UAH" }} />
      <NumberField source="quantity" label="Кількість" />
      <TextField source="status" label="Статус" />
    </SimpleShowLayout>
  </Show>
);

export const OrderEdit = () => (
  <Edit>
    <SimpleForm>
      <TextField source="id" label="ID" />
      <DateField source="createdAt" label="Дата" />
      <TextField source="customerName" label="Клієнт" />
      <SelectInput
        source="status"
        label="Статус"
        choices={ORDER_STATUS_CHOICES}
        validate={required()}
      />
    </SimpleForm>
  </Edit>
);