const ERROR_MESSAGES = {
  UNAUTHORIZED: "Необхідна авторизація",
  NETWORK_ERROR: "Проблеми з підключенням. Перевірте інтернет",
  SERVER_ERROR: "Помилка сервера. Спробуйте пізніше",
  NOT_FOUND: "Ресурс не знайдено",
  VALIDATION_ERROR: "Помилка валідації даних",
  UNKNOWN_ERROR: "Невідома помилка",
};

export const handleError = (error) => {
  if (!error) {
    return ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  const message = error.message || error;

  if (message.includes("401") || message.includes("Unauthorized")) {
    return ERROR_MESSAGES.UNAUTHORIZED;
  }

  if (message.includes("404") || message.includes("Not Found")) {
    return ERROR_MESSAGES.NOT_FOUND;
  }

  if (message.includes("500") || message.includes("Internal Server")) {
    return ERROR_MESSAGES.SERVER_ERROR;
  }

  if (message.includes("Failed to fetch") || message.includes("Network")) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (message.includes("400") || message.includes("Bad Request")) {
    return ERROR_MESSAGES.VALIDATION_ERROR;
  }

  return message || ERROR_MESSAGES.UNKNOWN_ERROR;
};

export const logError = (error, context = "") => {
  if (process.env.NODE_ENV === "development") {
    console.error(`[${context}]`, error);
  }
};

export default { handleError, logError };
