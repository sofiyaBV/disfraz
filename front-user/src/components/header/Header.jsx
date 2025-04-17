import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../style/header.module.css"; // Импорт стилей для хедера
import logoImage from "../../assets/LOGO.png"; // Импорт логотипа из assets
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from "react-icons/fa"; // Иконки для правой части хедера

const Header = () => {
  // Состояние для кнопки (чёрно-белая или бело-чёрная)
  const [isButtonActive, setIsButtonActive] = useState(false);

  // Функция для переключения состояния кнопки
  const handleButtonClick = () => {
    setIsButtonActive(!isButtonActive);
  };

  return (
    <header className={styles.header}>
      {/* Левая часть: троеточие и логотип */}
      <div className={styles.left_section}>
        {/* Троеточие (будущая выплывающая страница) */}
        <div className={styles.menu_icon}>
          {/* Можно добавить onClick для будущей функциональности */}
          <span>☰</span>
        </div>

        {/* Логотип */}
        <Link to="/">
          <img src={logoImage} alt="Logo" className={styles.logo} />
        </Link>
      </div>

      {/* Центральная часть: кнопка и поле поиска */}
      <div className={styles.center_section}>
        {/* Кнопка с переключением цвета */}
        <button
          className={`${styles.custom_button} ${
            isButtonActive ? styles.button_active : ""
          }`}
          onClick={handleButtonClick}
        >
          Каталог
        </button>

        {/* Поле поиска (пока только ввод) */}
        <div className={styles.search_container}>
          <input
            type="text"
            placeholder="Я ищу обувь"
            className={styles.search_input}
          />
          <FaSearch className={styles.search_icon} />
        </div>
      </div>

      {/* Правая часть: иконки */}
      <div className={styles.right_section}>
        {/* Иконка профиля (переход на страницу) */}
        <Link to="/profile" className={styles.icon_link}>
          <FaUser />
        </Link>

        {/* Иконка избранного (переход на страницу) */}
        <Link to="/favorites" className={styles.icon_link}>
          <FaHeart />
        </Link>

        {/* Иконка корзины (в будущем отображение над ней) */}
        <div className={styles.icon_link}>
          <FaShoppingCart />
          {/* Здесь можно добавить логику для отображения количества товаров */}
        </div>
      </div>
    </header>
  );
};

export default Header;
