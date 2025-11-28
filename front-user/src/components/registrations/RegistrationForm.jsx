import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../style/pages/auth/registration.module.css";
import dataProvider from "../../utils/services/dataProvider";
import ButtonGeneral from "../buttons/ButtonGeneral";
import useAuthForm from "../../utils/hooks/useAuthForm";
import { registrationValidation } from "../../utils/validation/authSchemas";

// Компонент форми реєстрації з підтримкою соціальних мереж
const RegistrationForm = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("phone");

  // Використання спільного хука для управління формою
  const {
    formData,
    errors,
    isSubmitting,
    serverError,
    serverMessage,
    handleChange,
    handleSubmit,
    setServerError,
    setServerMessage,
  } = useAuthForm({
    initialValues: {
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
      loginLater: false,
    },
    validationSchema: (data) => registrationValidation(data, method),
    onSubmit: async (data) => {
      const requestData =
        method === "phone"
          ? { phone: data.phone, password: data.password }
          : { email: data.email, password: data.password };

      return await dataProvider.create("users", { data: requestData });
    },
    redirectTo: "/home",
    redirectDelay: 800,
  });

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
    setServerError(null);
    setServerMessage(null);
  };

  const handleSkipRegistration = () => {
    navigate("/home");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Реєстрація</h2>

      <div className={styles.divider}>
        <span className={styles.dividerText}>
          За допомогою електронної пошти
        </span>
        <div className={styles.dividerLine}></div>
      </div>

      <div className={styles.methodOptions}>
        <label className={styles.methodLabel}>
          <input
            type="radio"
            name="registrationMethod"
            value="phone"
            checked={method === "phone"}
            onChange={handleMethodChange}
            className={styles.radio}
            disabled={isSubmitting}
          />
          За номером телефону
        </label>
        <label className={styles.methodLabel}>
          <input
            type="radio"
            name="registrationMethod"
            value="email"
            checked={method === "email"}
            onChange={handleMethodChange}
            className={styles.radio}
            disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              placeholder="your@email.com"
              disabled={isSubmitting}
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
              placeholder="Введіть пароль"
              disabled={isSubmitting}
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
              placeholder="Повторіть пароль"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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

        {serverError && <div className={styles.serverError}>{serverError}</div>}

        {serverMessage && (
          <div className={styles.serverMessage}>{serverMessage}</div>
        )}

        <div className={styles.actionButtons}>
          <div className={styles.submitButton}>
            <ButtonGeneral
              initialColor="#151515"
              borderColor="#151515"
              textColor="#F2F2F2"
              text={isSubmitting ? "Реєстрація..." : "Підтвердити"}
              width="100%"
              height="3rem"
              transitionDuration="0.3s"
              type="submit"
              colorHover="#333"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="button"
            className={styles.skipButton}
            onClick={handleSkipRegistration}
            disabled={isSubmitting}
          >
            Пропустити реєстрацію та перейти до каталогу
          </button>
        </div>
      </form>

      <div className={styles.additionalLinks}>
        <a href="/authorization">Вже маю акаунт</a>
      </div>
    </div>
  );
};

export default RegistrationForm;
