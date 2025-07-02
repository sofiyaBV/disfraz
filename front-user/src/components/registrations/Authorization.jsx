import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import facebook from "../../img/icon/facebook_color.png";
import google from "../../img/icon/google_color.png";
import add from "../../assets/add.png";
import add_hover from "../../assets/add_hover.png";
import styles from "../../style/authorization.module.css";
import dataProvider from "../../utils/dataProvider";
import ButtonGeneral from "../buttons/ButtonGeneral";
import { useAuth } from "../../utils/AuthContext";

// Компонент авторизації користувачів з підтримкою різних методів входу
const Authorization = ({ onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isPhoneLogin, setIsPhoneLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Безпечне закриття модального вікна з перенаправленням
  const safeClose = (message = null) => {
    if (typeof onClose === "function") {
      onClose(message);
    } else {
      console.warn("onClose is not a function, redirecting to home");
      navigate("/home");
    }
  };

  // Обробка callback від Google OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (token) {
      login(token);
      setSuccessMessage("Авторизація через Google успішна!");

      // Очищуємо URL від параметрів
      const newUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } else if (error) {
      setError("Помилка авторизації через Google. Спробуйте ще раз.");

      const newUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [login, navigate]);

  // Перемикання між методами входу (телефон/email)
  const toggleLoginMethod = () => {
    setIsPhoneLogin(!isPhoneLogin);
    setFormData({ ...formData, email: "", phone: "" });
    setError(null);
    setSuccessMessage(null);
  };

  // Обробка змін у полях форми
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (error) {
      setError(null);
    }
  };

  // Валідація даних форми
  const validateForm = () => {
    const { email, phone, password } = formData;

    if (!password) {
      setError("Пароль обов'язковий");
      return false;
    }

    if (password.length < 6) {
      setError("Пароль повинен бути не менше 6 символів");
      return false;
    }

    if (isPhoneLogin) {
      if (!phone) {
        setError("Введіть номер телефону");
        return false;
      }
      if (!/^\+?3?8?(0\d{9})$/.test(phone)) {
        setError("Некоректний формат номера телефону");
        return false;
      }
    } else {
      if (!email) {
        setError("Введіть email");
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Некоректний формат email");
        return false;
      }
    }

    return true;
  };

  // Відправка форми авторизації
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const params = {
        email: isPhoneLogin ? "" : formData.email,
        phone: isPhoneLogin ? formData.phone : "",
        password: formData.password,
      };

      const response = await dataProvider.signin(params);

      // Отримуємо токен з відповіді
      const token = response.data?.access_token || response.access_token;
      if (token) {
        login(token);
        setSuccessMessage("Авторизація пройшла успішно!");

        // Очищуємо форму
        setFormData({
          email: "",
          phone: "",
          password: "",
        });

        // Перенаправляємо через 1.5 секунди
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        setError("Токен не отриманий від сервера");
      }
    } catch (err) {
      console.error("Signin error:", err);

      // Обробка різних типів помилок
      let errorMessage = "Не вдалося авторизуватися. Спробуйте ще раз.";

      if (err.message) {
        if (err.message.includes("Invalid credentials")) {
          errorMessage = "Неправильний email/телефон або пароль";
        } else if (err.message.includes("User not found")) {
          errorMessage = "Користувача з такими даними не знайдено";
        } else if (
          err.message.includes("network") ||
          err.message.includes("fetch")
        ) {
          errorMessage = "Помилка з'єднання з сервером";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Авторизація через Google
  const handleGoogleAuth = () => {
    setError(null);
    setSuccessMessage(null);

    const apiUrl =
      process.env.REACT_APP_JSON_SERVER_URL || "http://localhost:3000";
    window.location.href = `${apiUrl}/auth/google`;
  };

  // Авторизація через Facebook (заглушка)
  const handleFacebookAuth = () => {
    setError("Авторизація через Facebook поки не реалізована");
  };

  // Пропуск авторизації
  const handleSkipAuth = () => {
    navigate("/home");
  };

  return (
    <div className={styles.container}>
      {/* Кнопка закриття */}
      <button
        className={styles.closeButton}
        onClick={() => safeClose()}
        type="button"
      >
        <img
          className={styles.closeIcon}
          src={add}
          alt="Close"
          onMouseEnter={(e) => (e.currentTarget.src = add_hover)}
          onMouseLeave={(e) => (e.currentTarget.src = add)}
        />
      </button>

      {/* Заголовок */}
      <h2 className={styles.title}>Вхід</h2>
      <p className={styles.subtitle}>Увійти за допомогою профілю</p>

      {/* Соціальні мережі */}
      <div className={styles.socialAuth}>
        <button
          type="button"
          className={`${styles.socialButton} ${styles.facebookButton}`}
          onClick={handleFacebookAuth}
          disabled={loading}
        >
          <img src={facebook} alt="Facebook" className={styles.socialIcon} />
          <span>FACEBOOK</span>
        </button>
        <button
          type="button"
          className={`${styles.socialButton} ${styles.googleButton}`}
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <img src={google} alt="Google" className={styles.socialIcon} />
          <span>GOOGLE</span>
        </button>
      </div>

      {/* Розділювач */}
      <div className={styles.divider}>
        <span className={styles.dividerText}>Або за допомогою</span>
        <div className={styles.dividerLine}></div>
      </div>

      {/* Вибір методу авторизації */}
      <div className={styles.methodOptions}>
        <label className={styles.methodLabel}>
          <input
            type="radio"
            name="loginMethod"
            value="phone"
            checked={isPhoneLogin}
            onChange={() => setIsPhoneLogin(true)}
            className={styles.radio}
            disabled={loading}
          />
          За номером телефону
        </label>
        <label className={styles.methodLabel}>
          <input
            type="radio"
            name="loginMethod"
            value="email"
            checked={!isPhoneLogin}
            onChange={() => setIsPhoneLogin(false)}
            className={styles.radio}
            disabled={loading}
          />
          По e-mail
        </label>
      </div>

      {/* Форма авторизації */}
      <div className={styles.form}>
        <form onSubmit={handleSubmit}>
          {/* Поле email/телефону */}
          <div className={styles.inputGroup}>
            <label htmlFor={isPhoneLogin ? "phone" : "email"}>
              {isPhoneLogin ? "Телефон" : "Email"}
            </label>
            <input
              type={isPhoneLogin ? "tel" : "email"}
              id={isPhoneLogin ? "phone" : "email"}
              name={isPhoneLogin ? "phone" : "email"}
              placeholder={isPhoneLogin ? "38 (___) ___ - __ -__" : "Email"}
              value={isPhoneLogin ? formData.phone : formData.email}
              onChange={handleChange}
              disabled={loading}
              required
              className={styles.input}
            />
          </div>

          {/* Поле пароля */}
          <div className={styles.inputGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              className={styles.input}
            />
          </div>

          {/* Повідомлення про помилки та успіх */}
          {error && <div className={styles.errorMessage}>{error}</div>}

          {successMessage && (
            <div className={styles.successMessage}>{successMessage}</div>
          )}

          {/* Додаткові посилання */}
          <div className={styles.formLinks}>
            <div className={styles.formLink}>
              <a
                href="#"
                className={loading ? styles.disabled : ""}
                onClick={(e) => e.preventDefault()}
              >
                Не пам'ятаю пароль
              </a>
            </div>
            <div className={styles.formLink}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (!loading) toggleLoginMethod();
                }}
                className={loading ? styles.disabled : ""}
              >
                {isPhoneLogin
                  ? "Увійти за допомогою електронної пошти"
                  : "Увійти за номером телефону"}
              </a>
            </div>
          </div>

          {/* Кнопки дій */}
          <div className={styles.actionButtons}>
            <div className={styles.actionButton}>
              <ButtonGeneral
                initialColor="#151515"
                borderColor="#151515"
                textColor="#F2F2F2"
                text={loading ? "Завантаження..." : "Увійти"}
                width="100%"
                height="3rem"
                transitionDuration="0.3s"
                type="submit"
                colorHover="#333"
                disabled={loading}
                onClick={handleSubmit}
                link="#"
              />
            </div>

            <div className={styles.orText}>Або</div>

            <button
              type="button"
              className={styles.skipButton}
              disabled={loading}
              onClick={handleSkipAuth}
            >
              ПРОДОВЖИТИ БЕЗ АВТОРИЗАЦІЇ
            </button>
          </div>
        </form>

        {/* Додаткові посилання */}
        <div className={styles.additionalLinks}>
          <a href="/registration">Я ще не маю акаунта</a>
        </div>
      </div>
    </div>
  );
};

export default Authorization;
