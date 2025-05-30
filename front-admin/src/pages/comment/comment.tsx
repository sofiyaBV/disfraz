import { BooleanField, BooleanInput, Datagrid, DateField, DeleteButton, Edit, FunctionField, ImageField, Link, List, ReferenceField, Show, SimpleForm, SimpleShowLayout, TextField } from "react-admin";

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

            {/* Email користувача */}
            <FunctionField
            label="Email користувача"
            render={record => record.user?.email || 'N/A'}
            />

            <DeleteButton />
        </SimpleShowLayout>
    </Show>
);


