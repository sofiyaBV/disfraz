import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../style/profile/profile.module.css";
import { useAuth } from "../../utils/context/AuthContext";
import dataProvider from "../../utils/services/dataProvider";

const ProfilePage = () => {
  const { user, logout, isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
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

  const menuItems = [
    { id: "profile", icon: "👤", label: "МОЇ ДАНІ", active: true },
    { id: "address", icon: "📍", label: "АДРЕСА" },
    { id: "favorites", icon: "🖤", label: "ОБРАНІ ТОВАРИ" },
    { id: "history", icon: "📋", label: "ІСТОРІЯ ПОКУПОК" },
    { id: "bonuses", icon: "💰", label: "БОНУСИ" },
    { id: "password", icon: "🔒", label: "ЗМІНИТИ ПАРОЛЬ" },
    { id: "logout", icon: "📤", label: "ВИХІД" },
  ];

  useEffect(() => {
    console.log(
      "ProfilePage useEffect - authLoading:",
      authLoading,
      "isAuthenticated:",
      isAuthenticated,
      "user:",
      user
    );

    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to registration");
      navigate("/");
      return;
    }

    console.log("User authenticated, fetching profile");
    fetchUserProfile();
  }, [isAuthenticated, authLoading, user, navigate]);

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

  const handleMenuClick = (itemId) => {
    if (itemId === "logout") {
      handleLogout();
      return;
    }
    setActiveSection(itemId);
    setError(null);
    setSuccessMessage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));

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
      errors.email = "Email обов'язковий";
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      errors.email = "Некоректний формат email";
    }

    if (editForm.phone && !/^\+?3?8?(0\d{9})$/.test(editForm.phone)) {
      errors.phone = "Некоректний формат номера телефону";
    }

    if (editForm.password) {
      if (editForm.password.length < 6) {
        errors.password = "Пароль повинен бути не менше 6 символів";
      }
      if (editForm.password !== editForm.confirmPassword) {
        errors.confirmPassword = "Паролі не співпадають";
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

      if (editForm.password) {
        updateData.password = editForm.password;
      }

      const response = await dataProvider.update("user/profile", {
        data: updateData,
      });

      setUserProfile(response.data);
      setIsEditing(false);
      setSuccessMessage("Профіль успішно оновлено!");

      setEditForm((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      setError(
        error.response?.data?.message || "Помилка при оновленні профілю"
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

  const renderProfileContent = () => {
    if (activeSection !== "profile") {
      return (
        <div className={styles.contentPlaceholder}>
          <h3>
            Розділ "{menuItems.find((item) => item.id === activeSection)?.label}
            " в розробці
          </h3>
          <p>Цей функціонал буде доданий пізніше</p>
        </div>
      );
    }

    return (
      <div className={styles.contentArea}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        <div className={styles.profileForm}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Телефон</label>
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={handleInputChange}
                className={`${styles.formInput} ${
                  formErrors.phone ? styles.error : ""
                }`}
                placeholder="+38 (___) ___-__-__"
              />
              {formErrors.phone && (
                <span className={styles.formError}>{formErrors.phone}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                className={`${styles.formInput} ${
                  formErrors.email ? styles.error : ""
                }`}
                required
              />
              {formErrors.email && (
                <span className={styles.formError}>{formErrors.email}</span>
              )}
            </div>

            <div className={styles.formGroup + " " + styles.fullWidth}>
              <label className={styles.formLabel}>
                Додати новий номер телефону
              </label>
              <input
                type="tel"
                placeholder="Введіть новий номер телефону"
                className={styles.formInput}
              />
              <small className={styles.helpText}>
                Потрібен для код, щоб ми тепер ви підтвердити цей як новий номер
                телефону та профілей
              </small>
            </div>
          </div>

          <div className={styles.submitArea}>
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? "ЗБЕРІГАЄТЬСЯ..." : "ЗБЕРЕГТИ ПРОФІЛЬ"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.loadingSpinner}>Ініціалізація...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.loadingSpinner}>Завантаження профілю...</div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLogo}>
          <div className={styles.logoIcon}>D</div>
          <span className={styles.logoText}>DISFRAZ</span>
        </div>

        <div className={styles.breadcrumb}>
          <span>МІЙ АКАУНТ</span>
          <span>/</span>
          <span>МОЇ ДАНІ</span>
          <span>/</span>
        </div>
      </div>

      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>МІЙ АКАУНТ</h2>
        </div>

        <nav className={styles.sidebarNav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`${styles.menuItem} ${
                activeSection === item.id ? styles.active : ""
              }`}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>{renderProfileContent()}</div>
    </div>
  );
};

export default ProfilePage;
