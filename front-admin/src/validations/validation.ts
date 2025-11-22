// Типи
type Validator = (value: string | undefined) => string | undefined;

// Email валідація
export const emailValidationFormat: Validator = (value) => {
  if (!value) return undefined;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !emailRegex.test(value) ? "Невірний формат пошти" : undefined;
};

// Телефон валідація
export const phoneValidationFormat: Validator = (value) => {
  if (!value) return undefined;

  if (!/^\+?[0-9]+$/.test(value)) {
    return "Невірний формат номера телефону";
  }

  if (value.length < 10 || value.length > 18) {
    return "Номер телефону повинен містити від 10 до 18 символів";
  }

  return undefined;
};

// Назва продукту
export const productNameValidationFormat: Validator = (value) => {
  if (!value) return undefined;

  if (value.length < 3) {
    return "Назва повинна містити принаймні 3 символи";
  }

  if (value.length > 50) {
    return "Назва не повинна перевищувати 50 символів";
  }

  return undefined;
};

// Ціна продукту
export const productPriceValidationFormat: Validator = (value) => {
  if (!value) return undefined;

  const price = Number(value);

  if (isNaN(price)) {
    return "Ціна повинна бути числом";
  }

  if (price <= 0) {
    return "Ціна повинна бути більшою за 0";
  }

  return undefined;
};

// Обов'язкове поле
export const required = (message = "Обов'язкове поле"): Validator => {
  return (value) => (value ? undefined : message);
};

// Мінімальна довжина
export const minLength = (min: number, message?: string): Validator => {
  return (value) => {
    if (!value) return undefined;
    return value.length < min
      ? message || `Мінімальна довжина ${min} символів`
      : undefined;
  };
};

// Максимальна довжина
export const maxLength = (max: number, message?: string): Validator => {
  return (value) => {
    if (!value) return undefined;
    return value.length > max
      ? message || `Максимальна довжина ${max} символів`
      : undefined;
  };
};

// Мінімальне значення
export const minValue = (min: number, message?: string): Validator => {
  return (value) => {
    if (!value) return undefined;
    return Number(value) < min
      ? message || `Мінімальне значення ${min}`
      : undefined;
  };
};

// Максимальне значення
export const maxValue = (max: number, message?: string): Validator => {
  return (value) => {
    if (!value) return undefined;
    return Number(value) > max
      ? message || `Максимальне значення ${max}`
      : undefined;
  };
};

// Тільки числа
export const numberOnly: Validator = (value) => {
  if (!value) return undefined;
  return isNaN(Number(value)) ? "Повинно бути числом" : undefined;
};

// Знижка (0-100)
export const discountValidation: Validator = (value) => {
  if (!value) return undefined;

  const discount = Number(value);

  if (isNaN(discount)) {
    return "Знижка повинна бути числом";
  }

  if (discount < 0 || discount > 100) {
    return "Знижка повинна бути від 0 до 100";
  }

  return undefined;
};

// Комбінування валідаторів
export const composeValidators =
  (...validators: Validator[]): Validator =>
  (value) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return undefined;
  };
