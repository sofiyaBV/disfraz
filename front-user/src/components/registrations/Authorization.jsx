import { useState } from "react";
import { useNavigate } from "react-router-dom";
import add from "../../assets/add.png";
import add_hover from "../../assets/add_hover.png";
import facebook from "../../img/icon/facebook_color.png";
import google from "../../img/icon/google_color.png";
import styles from "../../style/pages/auth/authorization.module.css";
import dataProvider from "../../utils/services/dataProvider";
import ButtonGeneral from "../buttons/ButtonGeneral";
import useAuthForm from "../../utils/hooks/useAuthForm";
import { signinValidation } from "../../utils/validation/authSchemas";

// Компонент авторизації користувачів з підтримкою різних методів входу
const Authorization = ({ onClose }) => {
  const navigate = useNavigate();
  const [isPhoneLogin, setIsPhoneLogin] = useState(true);

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
      email: "",
      phone: "",
      password: "",
    },
    validationSchema: (data) => signinValidation(data, isPhoneLogin),
    onSubmit: async (data) => {
      const params = isPhoneLogin
        ? { phone: data.phone, password: data.password }
        : { email: data.email, password: data.password };

      return await dataProvider.create("auth/signin", { data: params });
    },
    redirectTo: "/home",
    redirectDelay: 800,
  });

  const safeClose = (message = null) => {
    if (typeof onClose === "function") {
      onClose(message);
    } else {
      navigate("/home");
    }
  };

  const toggleLoginMethod = () => {
    setIsPhoneLogin(!isPhoneLogin);
    setServerError(null);
    setServerMessage(null);
  };

  const handleGoogleAuth = () => {
    setServerError(null);
    setServerMessage(null);

    const apiUrl = process.env.REACT_APP_JSON_SERVER_URL;

    if (!apiUrl) {
      setServerError("Конфігурація API не налаштована. Зверніться до адміністратора.");
      return;
    }

    window.location.href = `${apiUrl}/auth/google`;
  };

  const handleFacebookAuth = () => {
    setServerError("Авторизація через Facebook поки не реалізована");
  };

  const handleSkipAuth = () => {
    navigate("/home");
  };

  return (
    <div className={styles.container}>
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

      <h2 className={styles.title}>Вхід</h2>
      <p className={styles.subtitle}>Увійти за допомогою профілю</p>

      <div className={styles.socialAuth}>
        <button
          type="button"
          className={`${styles.socialButton} ${styles.facebookButton}`}
          onClick={handleFacebookAuth}
          disabled={isSubmitting}
        >
          <img src={facebook} alt="Facebook" className={styles.socialIcon} />
          <span>FACEBOOK</span>
        </button>
        <button
          type="button"
          className={`${styles.socialButton} ${styles.googleButton}`}
          onClick={handleGoogleAuth}
          disabled={isSubmitting}
        >
          <img src={google} alt="Google" className={styles.socialIcon} />
          <span>GOOGLE</span>
        </button>
      </div>

      <div className={styles.divider}>
        <span className={styles.dividerText}>Або за допомогою</span>
        <div className={styles.dividerLine}></div>
      </div>

      <div className={styles.methodOptions}>
        <label className={styles.methodLabel}>
          <input
            type="radio"
            name="loginMethod"
            value="phone"
            checked={isPhoneLogin}
            onChange={() => setIsPhoneLogin(true)}
            className={styles.radio}
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
          По e-mail
        </label>
      </div>

      <div className={styles.form}>
        <form onSubmit={handleSubmit}>
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
              disabled={isSubmitting}
              required
              className={styles.input}
            />
            {isPhoneLogin && errors.phone && (
              <div className={styles.errorMessage}>{errors.phone}</div>
            )}
            {!isPhoneLogin && errors.email && (
              <div className={styles.errorMessage}>{errors.email}</div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              className={styles.input}
            />
            {errors.password && (
              <div className={styles.errorMessage}>{errors.password}</div>
            )}
          </div>

          {serverError && <div className={styles.errorMessage}>{serverError}</div>}

          {serverMessage && (
            <div className={styles.successMessage}>{serverMessage}</div>
          )}

          <div className={styles.formLinks}>
            <div className={styles.formLink}>
              <a
                href="#"
                className={isSubmitting ? styles.disabled : ""}
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
                  if (!isSubmitting) toggleLoginMethod();
                }}
                className={isSubmitting ? styles.disabled : ""}
              >
                {isPhoneLogin
                  ? "Увійти за допомогою електронної пошти"
                  : "Увійти за номером телефону"}
              </a>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <div className={styles.actionButton}>
              <ButtonGeneral
                initialColor="#151515"
                borderColor="#151515"
                textColor="#F2F2F2"
                text={isSubmitting ? "Завантаження..." : "Увійти"}
                width="100%"
                height="3rem"
                transitionDuration="0.3s"
                type="submit"
                colorHover="#333"
                disabled={isSubmitting}
                onClick={handleSubmit}
                link="#"
              />
            </div>

            <div className={styles.orText}>Або</div>

            <button
              type="button"
              className={styles.skipButton}
              disabled={isSubmitting}
              onClick={handleSkipAuth}
            >
              ПРОДОВЖИТИ БЕЗ АВТОРИЗАЦІЇ
            </button>
          </div>
        </form>

        <div className={styles.additionalLinks}>
          <a href="/registration">Я ще не маю акаунта</a>
        </div>
      </div>
    </div>
  );
};

export default Authorization;
