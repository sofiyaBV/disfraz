import { List, Datagrid, TextField, Create, Edit, ReferenceInput, SelectInput, Show, SimpleForm, SimpleShowLayout, NumberField, useRecordContext, ArrayField, BooleanField, SimpleList,required } from "react-admin";
import { Grid, Typography, Card, CardContent } from "@mui/material";

export const ProductAttributeList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="product.name" label="Назва продукту" />
            <TextField source="attribute.material" label="Матеріал атрибута" />
            <TextField source="inStock"/>
        </Datagrid>
    </List>
);

const ProductOptionRenderer = () => {
    const record = useRecordContext();

    if (!record) {
        return null;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
                src={record.images && record.images[0] && record.images[0].url}
                alt={record.name}
                style={{ maxWidth: '50px', maxHeight: '50px', marginRight: '10px' }}
            />
            <Typography>{record.name}</Typography>
        </div>
    );
};

export const ProductAttributeEdit = () => (
    <Edit redirect="list">
        <SimpleForm>
            <ReferenceInput source="productId" reference="products" label="Продукт">
                <SelectInput optionText={<ProductOptionRenderer />} />
            </ReferenceInput>
            <ReferenceInput source="attributeId" reference="attributes" label="Атрибут">
                <SelectInput optionText="material" />
            </ReferenceInput>
            <SelectInput
                source="inStock"
                label="Чи є в наявності"
                choices={[
                    { id: 'Доступний на складі', name: 'Доступний на складі' },
                    { id: 'Є у наявності', name: 'Є у наявності' },
                    { id: 'Немає у наявності', name: 'Нкмає у наявності' },
                ]}
                validate={[required()]}
            />
        </SimpleForm>
    </Edit>
);

export const ProductAttributeShow = () => (
    <Show>
        <SimpleShowLayout>
            <NumberField source="id" label="ID" />
            <TextField source="inStock" label="Доступний на складі" />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Информация о продукте
                            </Typography>
                            <Typography variant="subtitle2">Назва продукту</Typography>
                            <TextField source="product.name" fullWidth  />
                            <Typography variant="subtitle2">Ціна продукту</Typography>
                            <TextField source="product.price" fullWidth  />
                            <Typography variant="subtitle2">Опис продукту</Typography>
                            <TextField source="product.description" fullWidth  />
                            <ArrayField label="Фотографії" source="product.images">
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <SimpleList primaryText={(record) => (
                                        <img key={record.url } src={record.url} alt="Фотографія" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                                    )} />
                                </div>
                            </ArrayField>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Информация об атрибуте
                            </Typography>
                            <Typography variant="subtitle2">Материал атрибута</Typography>
                            <TextField source="attribute.material" fullWidth />
                            <Typography variant="subtitle2">Размер атрибута</Typography>
                            <TextField source="attribute.size" fullWidth />
                            <Typography variant="subtitle2">Тема атрибута</Typography>
                            <TextField source="attribute.theme" fullWidth />
                            <Typography variant="subtitle2">Часть тела атрибута</Typography>
                            <TextField source="attribute.bodyPart" fullWidth />
                            <Typography variant="subtitle2">Набор атрибута</Typography>
                            <BooleanField source="attribute.isSet" />
                            <Typography variant="subtitle2">Описание атрибута</Typography>
                            <TextField source="attribute.description" fullWidth />
                            
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </SimpleShowLayout>
    </Show>
);

export const ProductAttributeCreate = () => (
    <Create redirect="list">
        <SimpleForm>
            <ReferenceInput source="productId" reference="products" label="Продукт">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput source="attributeId" reference="attributes" label="Атрибут">
                <SelectInput optionText="material" />
            </ReferenceInput>
            <SelectInput
                source="inStock"
                label="Чи є в наявності"
                choices={[
                    { id: 'Доступний на складі', name: 'Доступний на складі' },
                    { id: 'Є у наявності', name: 'Є у наявності' },
                    { id: 'Немає у наявності', name: 'Нкмає у наявності' },
                ]}
                validate={[required()]}
            />
        </SimpleForm>
    </Create>
);
