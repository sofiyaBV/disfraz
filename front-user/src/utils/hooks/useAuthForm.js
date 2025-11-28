import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useOAuthCallback from "./useOAuthCallback";

//Универсальний хук для форм авторизації та реєстрації

const useAuthForm = (options = {}) => {
  const {
    initialValues = {},
    validationSchema,
    onSubmit,
    redirectTo = "/home",
    redirectDelay = 800,
    autoLogin = true,
  } = options;

  // State management
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [serverMessage, setServerMessage] = useState(null);

  // Refs
  const timeoutRef = useRef(null);

  // Hooks
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Redirect after authentication
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      timeoutRef.current = setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 500);
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  // OAuth callback handling
  useOAuthCallback({
    onSuccess: (message) => setServerMessage(message),
    onError: (message) => setServerError(message),
    redirectTo,
    redirectDelay,
  });

  /**
   * Універсальний обробник зміни полів форми
   * Підтримує text inputs та checkboxes
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Очищення помилки для конкретного поля
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    // Очищення серверних повідомлень при зміні
    if (serverError) setServerError(null);
    if (serverMessage) setServerMessage(null);
  };

  /**
   * Валідація форми з використанням переданої схеми
   */
  const validate = () => {
    if (!validationSchema) return true;

    const validationErrors = validationSchema(formData);
    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  /**
   * Обробник сабміту форми
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валідація
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setServerError(null);
    setServerMessage(null);

    try {
      // Виклик переданої функції onSubmit
      const response = await onSubmit(formData);

      if (response) {
        // Автоматичний login якщо потрібно
        if (autoLogin) {
          login();
        }

        // Успішне повідомлення
        setServerMessage("Успішно! Перенаправлення...");

        // Очищення форми
        setFormData(initialValues);

        // Редірект
        timeoutRef.current = setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, redirectDelay);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Form submission error:", error);
      }

      // Обробка помилок
      let errorMessage = "Не вдалося виконати операцію. Спробуйте ще раз.";

      if (error.message) {
        if (error.message.includes("Invalid credentials")) {
          errorMessage = "Неправильний email/телефон або пароль";
        } else if (error.message.includes("User not found")) {
          errorMessage = "Користувача з такими даними не знайдено";
        } else if (error.message.includes("already exists")) {
          errorMessage = "Користувач з такими даними вже існує";
        } else if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          errorMessage = "Помилка з'єднання з сервером";
        } else {
          errorMessage = error.message;
        }
      }

      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Ручне встановлення значень форми
   */
  const setFieldValue = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Ручне встановлення помилок
   */
  const setFieldError = (name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  /**
   * Очищення форми
   */
  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
    setServerError(null);
    setServerMessage(null);
  };

  return {
    // State
    formData,
    errors,
    isSubmitting,
    serverError,
    serverMessage,

    // Handlers
    handleChange,
    handleSubmit,

    // Helper methods
    setFieldValue,
    setFieldError,
    setServerError,
    setServerMessage,
    resetForm,
  };
};

export default useAuthForm;
