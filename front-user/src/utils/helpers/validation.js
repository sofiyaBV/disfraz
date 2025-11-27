export const validateUkrainianPhone = (phone) => {
  if (!phone) return false;

  // Видаляємо всі нецифрові символи
  const cleaned = phone.replace(/\D/g, "");

  // Перевіряємо українські номери:
  // 380XXXXXXXXX (12 цифр, починається з 380)
  if (cleaned.length === 12 && cleaned.startsWith("380")) {
    const operatorCode = cleaned.substring(3, 5);
    // Перевіряємо валідні коди операторів
    const validOperatorCodes = [
      "39",
      "50",
      "63",
      "66",
      "67",
      "68",
      "73",
      "91",
      "92",
      "93",
      "94",
      "95",
      "96",
      "97",
      "98",
      "99",
    ];
    return validOperatorCodes.includes(operatorCode);
  }

  // 0XXXXXXXXX (10 цифр, починається з 0)
  if (cleaned.length === 10 && cleaned.startsWith("0")) {
    const operatorCode = cleaned.substring(1, 3);
    const validOperatorCodes = [
      "39",
      "50",
      "63",
      "66",
      "67",
      "68",
      "73",
      "91",
      "92",
      "93",
      "94",
      "95",
      "96",
      "97",
      "98",
      "99",
    ];
    return validOperatorCodes.includes(operatorCode);
  }

  return false;
};

/**
 * Валідація email адреси
 */
export const validateEmail = (email) => {
  if (!email) return false;

  // Більш строга перевірка email
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

/**
 * Валідація пароля
 * Мінімум 8 символів, обов'язково містить цифри та літери (2025 стандарт)
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireNumbers = true,
    requireLetters = true,
  } = options;

  if (!password) return { valid: false, message: "Пароль обов'язковий" };

  if (password.length < minLength) {
    return {
      valid: false,
      message: `Пароль повинен бути не менше ${minLength} символів`,
    };
  }

  if (requireNumbers && !/\d/.test(password)) {
    return {
      valid: false,
      message: "Пароль повинен містити принаймні одну цифру",
    };
  }

  if (requireLetters && !/[a-zA-Z]/.test(password)) {
    return {
      valid: false,
      message: "Пароль повинен містити принаймні одну літеру",
    };
  }

  return { valid: true, message: "" };
};

/**
 * Форматування українського номера телефону для відображення
 * 0501234567 -> +38 (050) 123-45-67
 */
export const formatUkrainianPhone = (phone) => {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  // Якщо номер починається з 380
  if (cleaned.startsWith("380") && cleaned.length === 12) {
    const code = cleaned.substring(3, 5);
    const part1 = cleaned.substring(5, 8);
    const part2 = cleaned.substring(8, 10);
    const part3 = cleaned.substring(10, 12);
    return `+38 (0${code}) ${part1}-${part2}-${part3}`;
  }

  // Якщо номер починається з 0
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    const code = cleaned.substring(1, 3);
    const part1 = cleaned.substring(3, 6);
    const part2 = cleaned.substring(6, 8);
    const part3 = cleaned.substring(8, 10);
    return `+38 (0${code}) ${part1}-${part2}-${part3}`;
  }

  return phone;
};

/**
 * Нормалізація українського номера телефону до формату +380XXXXXXXXX
 */
export const normalizeUkrainianPhone = (phone) => {
  if (!phone) return "";

  // Видаляємо всі нецифрові символи
  const cleaned = phone.replace(/\D/g, "");

  // Якщо номер починається з 380 (12 цифр)
  if (cleaned.startsWith("380") && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  // Якщо номер починається з 0 (10 цифр) - додаємо +38
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return `+38${cleaned}`;
  }

  // Якщо вже в правильному форматі з +
  if (phone.startsWith("+380") && cleaned.length === 12) {
    return phone;
  }

  return phone;
};
