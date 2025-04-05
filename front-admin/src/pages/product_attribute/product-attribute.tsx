import { List, Datagrid, Edit, SimpleForm, Show, Create, TextField,  NumberField, SimpleShowLayout, NumberInput } from "react-admin";


export const ProductAttributeList = () => (
    <List >
        <Datagrid >
            <TextField source="id" />
            <NumberField source="productId"/>
            <NumberField source="attributeId"/>
            //1 продукт
            //иного атрибутов
            
        </Datagrid>
    </List>
);

export const ProductAttributeEdit = () => (
    <Edit>
        <SimpleForm>
            <TextField source="id" />
        </SimpleForm>
    </Edit>
);

export const ProductAttributeShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <NumberField source="productId" />
            <NumberField source="attributeId" />
        </SimpleShowLayout>
    </Show>
);

export const ProductAttributeCreate = () => (
    <Create redirect="list">
        <SimpleForm>
            <NumberInput source="productId" label="ID продукту" />
            <NumberInput source="attributeId" label="ID атрибута" />
        </SimpleForm>
    </Create>
);
