import { BooleanField, BooleanInput, Datagrid, DateField, DeleteButton, Edit, List, Show, SimpleForm, SimpleShowLayout, TextField } from "react-admin";

export const CommentList = () => (
    <List>
        <Datagrid>
            <TextField source="id" label="Ідентифікатор" />
            <TextField source="content" label="Вміст" />
            <DateField source="createdAt" label="Дата створення" />
            <BooleanField source="isModerated" label="Пройшов перевірку" />
        </Datagrid>
    </List>
);

export const CommentEdit = () => (
    <Edit>
        <SimpleForm>
            <TextField source="id" label="Ідентифікатор" />
            <TextField source="content" label="Вміст" />
            <DateField source="createdAt" label="Дата створення" />
            <BooleanInput source="isModerated" label="Пройшов перевірку" />

            {/* //!нет атрибутов для вывода */}
            {/* продукт, до якого належить коментар */}
            {/* користувач, який залишив коментар */}
        </SimpleForm>
    </Edit>
);

export const CommentShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="Ідентифікатор" />
            <TextField source="content" label="Вміст" />
            <DateField source="createdAt" label="Дата створення" />
            <BooleanField source="isModerated" label="Пройшов перевірку" />

            {/* //!нет атрибутов для вывода */}
            {/* продукт, до якого належить коментар */}
            <TextField source="productAttributeId" label="Продукт" />
            <TextField source="userId" label="Користувач" />
            {/* користувач, який залишив коментар */}
            <DeleteButton />
        </SimpleShowLayout>
        
    </Show>
);


