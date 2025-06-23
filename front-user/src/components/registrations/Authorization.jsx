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

  // Функция безопасного закрытия модала с перенаправлением
  const safeClose = (message = null) => {
    if (typeof onClose === "function") {
      onClose(message);
    } else {
      console.warn("onClose is not a function, redirecting to home");
      // Перенаправляем на главную страницу
      navigate("/home");
    }
  };

  // Обработка Google OAuth callback (если пользователь вернулся с Google)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (token) {
      login(token);
      setSuccessMessage("Авторизація через Google успішна!");

      // Очищаем URL от параметров
      const newUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      setTimeout(() => {
        // Перенаправляем на главную страницу после успешной авторизации через Google
        navigate("/home");
      }, 1500);
    } else if (error) {
      setError("Помилка авторизації через Google. Спробуйте ще раз.");

      // Очищаем URL от параметров ошибки
      const newUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [login, navigate]);

  const toggleLoginMethod = () => {
    setIsPhoneLogin(!isPhoneLogin);
    setFormData({ ...formData, email: "", phone: "" });
    setError(null);
    setSuccessMessage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Очищаем ошибку при изменении полей
    if (error) {
      setError(null);
    }
  };

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

      console.log("Attempting signin with params:", params);
      const response = await dataProvider.signin(params);
      console.log("Signin successful:", response.data);

      // Извлекаем access_token из ответа
      const token = response.data.access_token;
      if (token) {
        login(token); // Сохраняем токен через AuthContext
        setSuccessMessage("Авторизація пройшла успішно!");

        // Очищаем форму
        setFormData({
          email: "",
          phone: "",
          password: "",
        });

        // Перенаправляем на главную страницу через 1.5 секунды
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        setError("Токен не отриманий від сервера");
      }
    } catch (err) {
      console.error("Signin error:", err);
      setError(err.message || "Не вдалося авторизуватися. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  // Функция для авторизации через Google
  const handleGoogleAuth = () => {
    setError(null);
    setSuccessMessage(null);

    // Перенаправляем на бекенд endpoint для Google OAuth
    const apiUrl =
      process.env.REACT_APP_JSON_SERVER_URL || "http://localhost:3000";
    window.location.href = `${apiUrl}/auth/google`;
  };

  // Функция для авторизации через Facebook (заглушка)
  const handleFacebookAuth = () => {
    setError("Авторизація через Facebook поки не реалізована");
  };

  // Функция для пропуска авторизации и перехода на главную
  const handleSkipAuth = () => {
    navigate("/home");
  };

  return (
    <div className={styles.component}>
      <img
        className={styles.add}
        src={add}
        alt="Close"
        onMouseEnter={(e) => (e.currentTarget.src = add_hover)}
        onMouseLeave={(e) => (e.currentTarget.src = add)}
        onClick={() => safeClose()}
      />

      <h2>Вхід</h2>
      <p>Увійти за допомогою профілю</p>

      {/* Кнопки социальных сетей */}
      <div className={styles.buttons}>
        <button
          type="button"
          onClick={handleFacebookAuth}
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          <img src={facebook} alt="Facebook" />
          <span>FACEBOOK</span>
        </button>
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          <img src={google} alt="Google" />
          <span>GOOGLE</span>
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
          Або за допомогою
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

      <div className={styles.form}>
        <p>
          {isPhoneLogin
            ? "За номером телефону"
            : "Увійти за допомогою електронної пошти"}
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label>
              <input
                type={isPhoneLogin ? "tel" : "email"}
                name={isPhoneLogin ? "phone" : "email"}
                placeholder={isPhoneLogin ? "38 (___) ___ - __ -__" : "Email"}
                value={isPhoneLogin ? formData.phone : formData.email}
                onChange={handleChange}
                disabled={loading}
                required
                style={{ opacity: loading ? 0.6 : 1 }}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
                style={{ opacity: loading ? 0.6 : 1 }}
              />
            </label>
          </div>

          {/* Сообщения об ошибках и успехе */}
          {error && (
            <div
              style={{
                color: "red",
                fontSize: "0.9rem",
                marginTop: "0.5rem",
                padding: "0.5rem",
                backgroundColor: "#ffe6e6",
                borderRadius: "4px",
              }}
            >
              {error}
            </div>
          )}

          {successMessage && (
            <div
              style={{
                color: "green",
                fontSize: "0.9rem",
                marginTop: "0.5rem",
                padding: "0.5rem",
                backgroundColor: "#e6ffe6",
                borderRadius: "4px",
              }}
            >
              {successMessage}
            </div>
          )}

          <p>
            <a href="#" style={{ color: loading ? "#ccc" : "#007bff" }}>
              Не пам'ятаю пароль
            </a>
          </p>
          <p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (!loading) toggleLoginMethod();
              }}
              style={{ color: loading ? "#ccc" : "#007bff" }}
            >
              {isPhoneLogin
                ? "Увійти за допомогою електронної пошти"
                : "Увійти за номером телефону"}
            </a>
          </p>
        </form>

        <p>
          <a
            href="/registration"
            style={{ color: loading ? "#ccc" : "#007bff" }}
          >
            Я ще не маю акаунта
          </a>
        </p>
      </div>

      <div className={styles.buttonsG}>
        <ButtonGeneral
          initialColor="black"
          borderColor="black"
          textColor="white"
          text={loading ? "Завантаження..." : "Увійти"}
          width="100%"
          height="3.4rem"
          transitionDuration="0.3s"
          type="submit"
          colorHover="red"
          disabled={loading}
          onClick={handleSubmit}
          link="#"
        />

        <p style={{ margin: "1rem 0", color: "#666" }}>Або</p>

        <ButtonGeneral
          initialColor="white"
          borderColor="black"
          textColor="black"
          text="ПРОДОВЖИТИ БЕЗ АВТОРИЗАЦІЇ"
          width="100%"
          height="3.4rem"
          transitionDuration="0.3s"
          type="button"
          disabled={loading}
          onClick={handleSkipAuth}
          link="#"
        />
      </div>
    </div>
  );
};

export default Authorization;
