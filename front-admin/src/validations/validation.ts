export const emailValidationFormat = (value: string) =>
    value && !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
        ? "Невірний формат пошти"
        : undefined;

export const phoneValidationFormat = (value: string) => {
    if (value && !/^\+?[0-9]+$/.test(value)) {
        return "Невірний формат номера телефону";
    }
    if (value && (value.length < 10 || value.length > 18)) {
        return "Номер телефону повинен містити від 10 до 18 символів";
    }
    return undefined;
};

export const productNameValidationFormat = (value: string) => {
    if (value && value.length < 3) {
        return "Назва продукту повинна містити принаймні 3 символи";
    }
    if (value && value.length > 50) {
        return "Назва продукту не повинна перевищувати 50 символів";
    }
    return undefined;
}

export const productPriceValidationFormat = (value: string) => {
    if (value && isNaN(Number(value))) {
        return "Ціна повинна бути числом";
    }
    if (value && Number(value) <= 0) {
        return "Ціна повинна бути більшою за 0";
    }
    return undefined;
};
