import React, { useState } from "react";
import styles from "../../style/pagesStyle/registration.module.css";
import ButtonGeneral from "../buttons/ButtonGeneral";
import dataProvider from "../../utils/dataProvider";
import { useAuth } from "../../utils/AuthContext";

const RegistrationForm = () => {
  const { login } = useAuth(); // Добавляем useAuth для авторизации
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
      console.log("Registration successful:", response.data);

      // Извлекаем access_token из ответа
      const token = response.data.access_token;
      if (token) {
        login(token); // Автоматически авторизуем пользователя
        setServerMessage(
          "Реєстрація успішна! Ви автоматично увійшли в систему."
        );
      } else {
        setServerMessage("Реєстрація успішна, але токен не отриманий.");
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

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Реєстрація</h2>
      <p className={styles.subtitle}>Оберіть спосіб реєстрації</p>
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
          link="/"
        />
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
