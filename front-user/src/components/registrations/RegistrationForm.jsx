import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../style/pages/auth/registration.module.css";
import { useAuth } from "../../utils/context/AuthContext";
import dataProvider from "../../utils/services/dataProvider";
import ButtonGeneral from "../buttons/ButtonGeneral";
import { validateUkrainianPhone, validateEmail } from "../../utils/helpers/validation";

// Компонент форми реєстрації з підтримкою соціальних мереж
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

  // Ref для збереження timeout ID для cleanup
  const timeoutRef = useRef(null);

  // Cleanup при unmount компонента
  useEffect(() => {
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

    if (error) {
      setServerError("Помилка авторизації через Google. Спробуйте ще раз.");

      const newUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (oauth === "success") {
      login();
      setServerMessage("Авторизація через Google успішна! Перенаправлення...");

      
      const newUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      timeoutRef.current = setTimeout(() => {
        navigate("/home");
      }, 1500);
    }
  }, [login, navigate]);

  // Зміна методу реєстрації 
  const handleMethodChange = (e) => {
    setMethod(e.target.value);
    setErrors({});
    setServerError(null);
    setServerMessage(null);
  };

  // Обробка змін у полях форми
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Валідація форми реєстрації
  const validateForm = () => {
    const newErrors = {};

    if (method === "phone") {
      if (!formData.phone) {
        newErrors.phone = "Номер телефону обов'язковий";
      } else if (!validateUkrainianPhone(formData.phone)) {
        newErrors.phone = "Некоректний формат номера телефону. Використовуйте формат: +380XXXXXXXXX або 0XXXXXXXXX";
      }
    } else {
      if (!formData.email) {
        newErrors.email = "E-mail обов'язковий";
      } else if (!validateEmail(formData.email)) {
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

  // Відправка форми реєстрації
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

      if (response) {
        login();
        setServerMessage(
          "Реєстрація успішна! Перенаправлення на головну сторінку..."
        );

        setFormData({
          phone: "",
          email: "",
          password: "",
          confirmPassword: "",
          agree: false,
          loginLater: false,
        });

        timeoutRef.current = setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Помилка при реєстрації:", error);
      }
      setServerError(
        error.message || "Помилка при реєстрації. Спробуйте ще раз."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Перехід на головну сторінку без реєстрації
  const handleSkipRegistration = () => {
    navigate("/home");
  };

  return (
    <div className={styles.container}>
      {/* Заголовок */}
      <h2 className={styles.title}>Реєстрація</h2>

      {/* Розділювач */}
      <div className={styles.divider}>
        <span className={styles.dividerText}>
          За допомогою електронної пошти
        </span>
        <div className={styles.dividerLine}></div>
      </div>

      {/* Вибір методу реєстрації */}
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
        {/* Поле телефону або email */}
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

        {/* Поле пароля */}
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

        {/* Поле підтвердження пароля */}
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

        {/* Чекбокс підписки */}
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

        {/* Чекбокс згоди */}
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

        {/* Повідомлення про помилки та успіх */}
        {serverError && <div className={styles.serverError}>{serverError}</div>}

        {serverMessage && (
          <div className={styles.serverMessage}>{serverMessage}</div>
        )}

        {/* Кнопки дій */}
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

      {/* Додаткові посилання */}
      <div className={styles.additionalLinks}>
        <a href="/authorization">Вже маю акаунт</a>
      </div>
    </div>
  );
};

export default RegistrationForm;
