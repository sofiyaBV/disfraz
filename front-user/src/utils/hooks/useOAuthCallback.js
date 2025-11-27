import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Централізований hook для обробки OAuth редіректів (Google, Facebook, etc.)
 * Парсить URL параметри ?oauth=success або ?error=...
 *
 * @param {Object} options - Опції конфігурації
 * @param {Function} options.onSuccess - Callback при успішній OAuth авторизації
 * @param {Function} options.onError - Callback при помилці OAuth
 * @param {string} options.redirectTo - Куди редіректити після успіху (за замовчуванням /home)
 * @param {number} options.redirectDelay - Затримка перед редіректом в мс (за замовчуванням 800)
 */
const useOAuthCallback = (options = {}) => {
  const {
    onSuccess,
    onError,
    redirectTo = "/home",
    redirectDelay = 800,
  } = options;

  const { login } = useAuth();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauth = urlParams.get("oauth");
    const error = urlParams.get("error");

    // Функція очищення URL від параметрів
    const cleanUrl = () => {
      const newUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    };

    // Обробка помилки OAuth
    if (error && typeof error === "string") {
      const errorMessage = "Помилка авторізації через Google. Спробуйте ще раз.";

      if (process.env.NODE_ENV === 'development') {
        console.error("OAuth error:", error);
      }

      cleanUrl();

      if (onError) {
        onError(errorMessage);
      }

      return;
    }

    // Обробка успішної OAuth авторизації
    if (oauth === "success") {
      if (process.env.NODE_ENV === 'development') {
        console.log("OAuth success, logging in user");
      }

      login();
      cleanUrl();

      const successMessage = "Авторізація через Google успішна! Перенаправлення...";

      if (onSuccess) {
        onSuccess(successMessage);
      }

      // Редірект з затримкою
      timeoutRef.current = setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, redirectDelay);
    }
  }, [login, navigate, redirectTo, redirectDelay, onSuccess, onError]);

  return null;
};

export default useOAuthCallback;
