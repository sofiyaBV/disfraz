import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../style/header.module.css";
import logoImage from "../../assets/LOGO.png";
import menuImage from "../../assets/menu.png";
import ButtonGeneral from "../buttons/ButtonGeneral";
import BurgerMenuLogged from "./BurgerMenuLogged"; // Импортируем компонент меню

// Импорт SVG-иконок
import FaSearch from "../../assets/svg/search-normal.svg";
import FaHeart from "../../assets/svg/heart.svg";
import FaShoppingCart from "../../assets/svg/shopping-bag.svg";
import FaUser from "../../assets/svg/profile.svg";

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isSearchFocused || isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSearchFocused, isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {(isSearchFocused || isMenuOpen) && (
        <div
          className={styles.overlay}
          onClick={isMenuOpen ? toggleMenu : undefined}
        ></div>
      )}
      <header className={styles.header}>
        <div className={styles.left_section}>
          <div className={styles.menu_icon}>
            <div onClick={toggleMenu}>
              <img src={menuImage} alt="Menu" className={styles.menu_image} />
            </div>
          </div>
          <Link to="/">
            <img src={logoImage} alt="Logo" className={styles.logo} />
          </Link>
        </div>

        <div className={styles.center_section}>
          <ButtonGeneral
            initialColor="black"
            text="Каталог"
            width="10.4rem"
            height="3rem"
            transitionDuration="0.1s"
            link="/catalog"
            textColor="#fff"
          />

          <div className={styles.search_container}>
            <input
              type="text"
              className={styles.search_input}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 100)}
              placeholder="Знайти собі образ"
            />

            <img
              src={FaSearch}
              alt="Search"
              className={`${styles.search_icon} ${
                isSearchFocused ? styles.search_icon_focused : ""
              }`}
            />

            {isSearchFocused && (
              <button className={styles.search_button}>
                <span>Знайти</span>
                <img
                  src={FaSearch}
                  alt="Search"
                  className={styles.search_button_icon}
                />
              </button>
            )}

            {isSearchFocused && (
              <div className={styles.search_popup}>
                <div className={styles.recent_searches}>
                  <h4>Популярні запити</h4>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.right_section}>
          <Link to="/profile" className={styles.icon_link}>
            <img src={FaUser} alt="Profile" />
          </Link>
          <Link to="/favorites" className={styles.icon_link}>
            <img src={FaHeart} alt="Favorites" />
          </Link>
          <div className={styles.icon_link}>
            <img src={FaShoppingCart} alt="Cart" />
          </div>
        </div>
      </header>
      {isMenuOpen && <BurgerMenuLogged onClose={toggleMenu} />}
    </>
  );
};

export default Header;
