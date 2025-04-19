import React from "react";
import { Link } from "react-router-dom";
import styles from "../../style/header.module.css";
import logoImage from "../../assets/LOGO.png"; // Импорт логотипа из assets
import menuImage from "../../assets/menu.png"; // Импорт изображения меню
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from "react-icons/fa"; // Иконки для правой части хедера
import ButtonGeneral from "../buttons/ButtonGeneral"; // Импорт нового компонента кнопки

const Header = () => {
  return (
    <header className={styles.header}>
      {/* Левая часть: меню и логотип */}
      <div className={styles.left_section}>
        {/* Изображение меню вместо троеточия */}
        <div className={styles.menu_icon}>
          {/* Можно добавить onClick для будущей функциональности */}
          <img src={menuImage} alt="Menu" className={styles.menu_image} />
        </div>

        {/* Логотип */}
        <Link to="/">
          <img src={logoImage} alt="Logo" className={styles.logo} />
        </Link>
      </div>

      {/* Центральная часть: кнопка и поле поиска */}
      <div className={styles.center_section}>
        {/* Используем новый компонент ButtonGeneral */}
        <ButtonGeneral initialColor="black" text="Каталог" />

        {/* Поле поиска (растянутое на доступное пространство) */}
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
