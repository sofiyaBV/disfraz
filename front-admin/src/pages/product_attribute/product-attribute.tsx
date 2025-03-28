import { List, Datagrid, Edit, SimpleForm, Show, Create, TextField } from "react-admin";


export const ProductAttributeList = () => (
    <List >
        <Datagrid >
            <TextField source="id" />
            //1 продукт
            //иного атрибутов
            
        </Datagrid>
    </List>
);

export const ProductAttributeEdit = () => (
    <Edit>
        <SimpleForm>
            <TextField source="id" />
            //1 продукт выбираем через список продуктов(как в юзере - 1)
            //много атрибутов выбираем через список атрибутов(как в юзере - много)
            //показывает список корзин в составе которых были выбраннные товары
        </SimpleForm>
    </Edit>
);

export const ProductAttributeShow = () => (
    <Show>
        <SimpleForm>
            <TextField source="id" />
            //1 продукт
            //много атрибутов
            //список корзин в составе которых были выбраннные товары

        </SimpleForm>
    </Show>
);

export const ProductAttributeCreate = () => (
    <Create redirect="list">
        <SimpleForm>
            //1 продукт выбираем через список продуктов(как в юзере - 1)
            //много атрибутов выбираем через список атрибутов(как в юзере - много)
        </SimpleForm>
    </Create>
);
