import { BooleanField, BooleanInput, Datagrid, DateField, Edit, List, Show, SimpleForm, TextField } from "react-admin";


export const CommentList = () => (
    <List >
        <Datagrid >
            <TextField source="id" />
            <TextField source="content" />
            <DateField source="createdAt" />
            <BooleanField source="isModerated" />
        </Datagrid>
    </List>
);

export const CommentEdit = () => (
    <Edit>
        <SimpleForm>
        <TextField source="id" />
            <TextField source="content" />
            <DateField source="createdAt" />
            <BooleanInput source="isModerated" />
            //продукт к которому относится комментарий
            //пользователь который оставил комментарий
        </SimpleForm>
    </Edit>
);

export const CommentShow = () => (
    <Show>
        <SimpleForm>
        <TextField source="id" />
            <TextField source="content" />
            <DateField source="createdAt" />
            <BooleanField source="isModerated" />
            //продукт к которому относится комментарий
            //пользователь который оставил комментарий
        </SimpleForm>
    </Show>
);


