import { List, Datagrid, Edit, SimpleForm, Show, DateField, TextField, SimpleShowLayout } from "react-admin";


export const OrderList = () => (
    <List >
        <Datagrid >
            <TextField source="id" />
            <DateField source="createdAt" />
            <TextField source="customerName" />
            <TextField source="notes" />
            <TextField source="status" />
        </Datagrid>
    </List>
);

import { SelectInput } from "react-admin";

export const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <TextField source="id" label="Ідентифікатор" />
            <DateField source="createdAt" label="Дата створення" />
            <TextField source="customerName" label="Ім'я клієнта" />
            <TextField source="notes" label="Примітки" />
            <SelectInput 
            source="status" 
            label="Статус"
            choices={[
                { id: 'pending', name: 'Очікується' },
                { id: 'processing', name: 'Обробляється' },
                { id: 'completed', name: 'Завершено' },
                { id: 'cancelled', name: 'Скасовано' },
            ]}
            />
        </SimpleForm>
    </Edit>
);

export const OrderShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="Ідентифікатор" />
            <DateField source="createdAt" label="Дата створення" />
            <TextField source="customerName" label="Ім'я клієнта" />
            <TextField source="customerEmail" label="Електронна пошта клієнта" />
            <TextField source="customerPhone" label="Телефон клієнта" />
            <TextField source="deliveryAddress" label="Адреса доставки" />
            <TextField source="notes" label="Примітки" />
            <TextField source="productAttributeIds" label="Атрибути продукту" />
            <TextField source="price" label="Ціна" />
            <TextField source="quantity" label="Кількість" />
            {/* <TextField source="userId" label="Ідентифікатор користувача" /> */}
            <TextField source="status" label="Статус" />
        </SimpleShowLayout>
    </Show>
);

