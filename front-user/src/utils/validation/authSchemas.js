import {
  validateUkrainianPhone,
  validateEmail,
  validatePassword,
} from "../helpers/validation";

//Валідаційна схема для форми авторизації

export const signinValidation = (formData, isPhoneLogin) => {
  const errors = {};

  // Валідація phone/email
  if (isPhoneLogin) {
    if (!formData.phone) {
      errors.phone = "Введіть номер телефону";
    } else if (!validateUkrainianPhone(formData.phone)) {
      errors.phone =
        "Некоректний формат номера телефону. Використовуйте формат: +380XXXXXXXXX або 0XXXXXXXXX";
    }
  } else {
    if (!formData.email) {
      errors.email = "Введіть email";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Некоректний формат email";
    }
  }

  // Валідація пароля через validatePassword
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.message;
  }

  return errors;
};

// Валідаційна схема для форми реєстрації

export const registrationValidation = (formData, method) => {
  const errors = {};

  // Валідація phone/email
  if (method === "phone") {
    if (!formData.phone) {
      errors.phone = "Номер телефону обов'язковий";
    } else if (!validateUkrainianPhone(formData.phone)) {
      errors.phone =
        "Некоректний формат номера телефону. Використовуйте формат: +380XXXXXXXXX або 0XXXXXXXXX";
    }
  } else {
    if (!formData.email) {
      errors.email = "E-mail обов'язковий";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Некоректний формат e-mail";
    }
  }

  // Валідація пароля через validatePassword з helpers/validation.js
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.message;
  }

  // Валідація підтвердження пароля
  if (!formData.confirmPassword) {
    errors.confirmPassword = "Підтвердження пароля обов'язкове";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Паролі не співпадають";
  }

  // Валідація згоди з умовами
  if (!formData.agree) {
    errors.agree = "Необхідно погодитися з умовами";
  }

  return errors;
};
