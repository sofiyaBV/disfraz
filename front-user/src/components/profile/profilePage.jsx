import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../style/profile/profile.module.css";
import ButtonGeneral from "../buttons/ButtonGeneral";
import dataProvider from "../../utils/dataProvider";
import { useAuth } from "../../utils/AuthContext";
import Header from "../header/Header";

const ProfilePage = () => {
  const { token, logout, isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [userProfile, setUserProfile] = useState({
    email: "",
    phone: "",
    createdAt: "",
    roles: [],
  });

  const [editForm, setEditForm] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    console.log(
      "ProfilePage useEffect - authLoading:",
      authLoading,
      "token:",
      token,
      "isAuthenticated:",
      isAuthenticated
    );

    // Ждем загрузки AuthContext
    if (authLoading) {
      return;
    }

    // Проверяем токен только после загрузки AuthContext
    if (!token) {
      console.log("No token found, redirecting to registration");
      navigate("/"); // Перенаправляем на главную (регистрацию)
      return;
    }

    console.log("Token found, fetching profile");
    fetchUserProfile();
  }, [token, authLoading, isAuthenticated, navigate]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching user profile...");
      const response = await dataProvider.getOne("user/profile");
      console.log("Profile response:", response);

      setUserProfile(response.data);
      setEditForm({
        email: response.data.email || "",
        phone: response.data.phone || "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Ошибка при получении профиля:", error);
      setError("Не удалось загрузить профиль. Попробуйте еще раз.");

      if (error.response?.status === 401) {
        console.log("401 error, logging out");
        logout();
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setFormErrors({});
    setError(null);
    setSuccessMessage(null);

    if (!isEditing) {
      // Сбрасываем форму при входе в режим редактирования
      setEditForm({
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Очищаем ошибку для этого поля
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!editForm.email.trim()) {
      errors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      errors.email = "Некорректный формат email";
    }

    if (editForm.phone && !/^\+?3?8?(0\d{9})$/.test(editForm.phone)) {
      errors.phone = "Некорректный формат номера телефона";
    }

    if (editForm.password) {
      if (editForm.password.length < 6) {
        errors.password = "Пароль должен быть не менее 6 символов";
      }
      if (editForm.password !== editForm.confirmPassword) {
        errors.confirmPassword = "Пароли не совпадают";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updateData = {
        email: editForm.email,
        phone: editForm.phone || null,
      };

      // Добавляем пароль только если он был введен
      if (editForm.password) {
        updateData.password = editForm.password;
      }

      const response = await dataProvider.update("user/profile", {
        data: updateData,
      });

      setUserProfile(response.data);
      setIsEditing(false);
      setSuccessMessage("Профиль успешно обновлен!");

      // Очищаем поля пароля
      setEditForm((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      setError(
        error.response?.data?.message || "Ошибка при обновлении профиля"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("uk-UA");
  };

  // Показываем загрузку пока AuthContext инициализируется
  if (authLoading) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.loadingSpinner}>Инициализация...</div>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.loadingSpinner}>Загрузка профиля...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.title}>Мій профіль</h1>

          {error && <div className={styles.errorMessage}>{error}</div>}

          {successMessage && (
            <div className={styles.successMessage}>{successMessage}</div>
          )}

          {!isEditing ? (
            // Режим просмотра
            <div className={styles.profileInfo}>
              <div className={styles.infoGroup}>
                <label className={styles.label}>Email:</label>
                <p className={styles.value}>{userProfile.email}</p>
              </div>

              <div className={styles.infoGroup}>
                <label className={styles.label}>Телефон:</label>
                <p className={styles.value}>
                  {userProfile.phone || "Не указан"}
                </p>
              </div>

              <div className={styles.infoGroup}>
                <label className={styles.label}>Дата регистрации:</label>
                <p className={styles.value}>
                  {formatDate(userProfile.createdAt)}
                </p>
              </div>

              <div className={styles.infoGroup}>
                <label className={styles.label}>Роль:</label>
                <p className={styles.value}>
                  {userProfile.roles?.join(", ") || "user"}
                </p>
              </div>

              <div className={styles.buttonGroup}>
                <ButtonGeneral
                  text="Редактировать профиль"
                  onClick={handleEditToggle}
                  width="200px"
                  height="40px"
                  initialColor="#007bff"
                  textColor="#fff"
                />

                <ButtonGeneral
                  text="Выйти"
                  onClick={handleLogout}
                  width="120px"
                  height="40px"
                  initialColor="#dc3545"
                  textColor="#fff"
                />
              </div>
            </div>
          ) : (
            // Режим редактирования
            <form onSubmit={handleSaveProfile} className={styles.editForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    formErrors.email ? styles.inputError : ""
                  }`}
                  required
                />
                {formErrors.email && (
                  <span className={styles.error}>{formErrors.email}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Телефон:
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    formErrors.phone ? styles.inputError : ""
                  }`}
                  placeholder="+38 (___) ___-__-__"
                />
                {formErrors.phone && (
                  <span className={styles.error}>{formErrors.phone}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  Новый пароль (оставьте пустым, если не хотите менять):
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={editForm.password}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    formErrors.password ? styles.inputError : ""
                  }`}
                />
                {formErrors.password && (
                  <span className={styles.error}>{formErrors.password}</span>
                )}
              </div>

              {editForm.password && (
                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword" className={styles.label}>
                    Подтвердите новый пароль:
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={editForm.confirmPassword}
                    onChange={handleInputChange}
                    className={`${styles.input} ${
                      formErrors.confirmPassword ? styles.inputError : ""
                    }`}
                  />
                  {formErrors.confirmPassword && (
                    <span className={styles.error}>
                      {formErrors.confirmPassword}
                    </span>
                  )}
                </div>
              )}

              <div className={styles.buttonGroup}>
                <ButtonGeneral
                  text={isSubmitting ? "Сохранение..." : "Сохранить"}
                  type="submit"
                  disabled={isSubmitting}
                  width="140px"
                  height="40px"
                  initialColor="#28a745"
                  textColor="#fff"
                />

                <ButtonGeneral
                  text="Отмена"
                  onClick={handleEditToggle}
                  type="button"
                  width="120px"
                  height="40px"
                  initialColor="#6c757d"
                  textColor="#fff"
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
