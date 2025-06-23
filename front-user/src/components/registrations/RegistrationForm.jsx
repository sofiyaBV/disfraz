import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../style/pagesStyle/registration.module.css";
import ButtonGeneral from "../buttons/ButtonGeneral";
import dataProvider from "../../utils/dataProvider";
import { useAuth } from "../../utils/AuthContext";

const RegistrationForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState("phone");
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
    loginLater: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [serverMessage, setServerMessage] = useState(null);

  // Обробка Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (token) {
      login(token);
      setServerMessage("Авторизація через Google успішна! Перенаправлення...");
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } else if (error) {
      setServerError("Помилка авторизації через Google. Спробуйте ще раз.");
    }
  }, [login, navigate]);

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
    setErrors({});
    setServerError(null);
    setServerMessage(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (method === "phone") {
      if (!formData.phone) {
        newErrors.phone = "Номер телефону обов'язковий";
      } else if (!/^\+?3?8?(0\d{9})$/.test(formData.phone)) {
        newErrors.phone = "Некоректний формат номера телефону";
      }
    } else {
      if (!formData.email) {
        newErrors.email = "E-mail обов'язковий";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Некоректний формат e-mail";
      }
    }
    if (!formData.password) {
      newErrors.password = "Пароль обов'язковий";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль повинен бути не менше 6 символів";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Підтвердження пароля обов'язкове";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Паролі не співпадають";
    }
    if (!formData.agree) {
      newErrors.agree = "Необхідно погодитися з умовами";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError(null);
    setServerMessage(null);

    try {
      const requestData = {
        email: method === "email" ? formData.email : "",
        phone: method === "phone" ? formData.phone : "",
        password: formData.password,
      };

      const response = await dataProvider.create("users", {
        data: requestData,
      });

      console.log("Full registration response:", response);
      console.log("Response data:", response.data);

      const token =
        response.data?.access_token ||
        response.data?.token ||
        response.access_token ||
        response.token;

      if (token) {
        login(token);
        setServerMessage(
          "Реєстрація успішна! Перенаправлення на головну сторінку..."
        );

        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        setServerMessage(
          "Реєстрація успішна! Перенаправлення на головну сторінку..."
        );

        setTimeout(() => {
          navigate("/home");
        }, 2000);

        console.warn(
          "Токен не знайдено в відповіді сервера. Структура відповіді:",
          response
        );
      }

      setFormData({
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        agree: false,
        loginLater: false,
      });
    } catch (error) {
      console.error("Помилка при реєстрації:", error);
      setServerError(
        error.message || "Помилка при реєстрації. Спробуйте ще раз."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функція для авторизації через Google
  const handleGoogleAuth = () => {
    // Перенаправляємо на бекенд endpoint для Google OAuth
    window.location.href = `${
      process.env.REACT_APP_API_URL || "http://localhost:3000"
    }/auth/google`;
  };

  // Функція для переходу на головну сторінку без реєстрації
  const handleSkipRegistration = () => {
    navigate("/home");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Реєстрація</h2>
      <p className={styles.subtitle}>Оберіть спосіб реєстрації</p>

      {/* Кнопки социальных сетей */}
      <div className={styles.socialAuth} style={{ marginBottom: "2rem" }}>
        <button
          type="button"
          onClick={handleGoogleAuth}
          style={{
            width: "48%",
            padding: "0.75rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            background: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
            marginRight: "4%",
          }}
        >
          <span style={{ color: "#4285f4" }}>G</span>
          GOOGLE
        </button>

        <button
          type="button"
          style={{
            width: "48%",
            padding: "0.75rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            background: "#1877f2",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          <span>f</span>
          FACEBOOK
        </button>
      </div>

      {/* Разделитель */}
      <div
        style={{
          textAlign: "center",
          margin: "1.5rem 0",
          position: "relative",
        }}
      >
        <span
          style={{
            background: "#fff",
            padding: "0 1rem",
            color: "#666",
            fontSize: "0.9rem",
          }}
        >
          За допомогою електронної пошти
        </span>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "1px",
            background: "#ddd",
            zIndex: -1,
          }}
        ></div>
      </div>

      <div className={styles.methodOptions}>
        <label className={styles.methodLabel}>
          <input
            type="radio"
            value="phone"
            checked={method === "phone"}
            onChange={handleMethodChange}
            className={styles.radio}
          />
          За номером телефону
        </label>
        <label className={styles.methodLabel}>
          <input
            type="radio"
            value="email"
            checked={method === "email"}
            onChange={handleMethodChange}
            className={styles.radio}
          />
          По e-mail
        </label>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        {method === "phone" ? (
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Телефон</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? styles.inputError : styles.input}
              placeholder="38 (___) ___-__-__"
            />
            {errors.phone && (
              <span className={styles.error}>{errors.phone}</span>
            )}
          </div>
        ) : (
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.inputError : styles.input}
              placeholder=""
            />
            {errors.email && (
              <span className={styles.error}>{errors.email}</span>
            )}
          </div>
        )}
        <div className={styles.inputGroup}>
          <label htmlFor="password">Пароль</label>
          <div className={styles.passwordWrapper}>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.inputError : styles.input}
              placeholder=""
            />
            <span className={styles.eyeIcon}>👁️</span>
          </div>
          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Підтвердити пароль</label>
          <div className={styles.passwordWrapper}>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={
                errors.confirmPassword ? styles.inputError : styles.input
              }
              placeholder=""
            />
            <span className={styles.eyeIcon}>👁️</span>
          </div>
          {errors.confirmPassword && (
            <span className={styles.error}>{errors.confirmPassword}</span>
          )}
        </div>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="loginLater"
              checked={formData.loginLater}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <span>Підписатись на розсилку</span>
          </label>
        </div>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <span>
              Я погоджуюсь з{" "}
              <a href="/policy" className={styles.link}>
                політикою конфіденційності сайту Disfraz.com.
              </a>
            </span>
          </label>
          {errors.agree && <span className={styles.error}>{errors.agree}</span>}
        </div>

        <ButtonGeneral
          initial
          dérColor="#151515"
          text={isSubmitting ? "Реєстрація..." : "Підтвердити"}
          width="100%"
          height="3rem"
          textColor="#F2F2F2"
          type="submit"
          disabled={isSubmitting}
        />

        <button
          type="button"
          onClick={handleSkipRegistration}
          style={{
            marginTop: "1rem",
            background: "transparent",
            border: "none",
            color: "#666",
            textDecoration: "underline",
            cursor: "pointer",
            width: "100%",
            textAlign: "center",
          }}
        >
          Пропустити реєстрацію та перейти до каталогу
        </button>

        {serverMessage && (
          <div className={styles.serverMessage}>
            <span>{serverMessage}</span>
          </div>
        )}
        {serverError && (
          <div className={styles.serverError}>
            <span>{serverError}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegistrationForm;
