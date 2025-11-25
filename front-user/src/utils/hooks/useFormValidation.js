import { useState } from "react";

const useFormValidation = (initialState, validationRules) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Обробка зміни значень форми
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Валідація всієї форми
  const validate = () => {
    const newErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const validator = validationRules[fieldName];
      const error = validator(formData[fieldName], formData);

      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Скидання форми
  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
  };

  // Встановлення конкретної помилки
  const setFieldError = (fieldName, errorMessage) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
    }));
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    validate,
    resetForm,
    setFieldError,
  };
};

export default useFormValidation;
