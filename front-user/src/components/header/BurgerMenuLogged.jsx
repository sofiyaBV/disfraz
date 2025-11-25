import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../style/components/navigation/burgerMenu.module.css";
import ButtonGeneral from "../buttons/ButtonGeneral";
import Authorization from "../registrations/Authorization";
import { useAuth } from "../../utils/context/AuthContext";
import CatalogMenu from "./CatalogMenu";
import {
  FaHome,
  FaUser,
  FaShoppingCart,
  FaBox,
  FaComments,
  FaChevronDown,
  FaTimes,
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaPinterest,
  FaLinkedin,
  FaTiktok,
  FaWhatsapp,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import LOGO from "../../assets/LOGO.png";
import vector from "../../img/Vector.png";

const BurgerMenuLogged = ({ onClose }) => {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCatalogMenuOpen, setIsCatalogMenuOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isClosing] = useState(false);

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = (message) => {
    setIsAuthModalOpen(false);
    if (message) {
      setSuccessMessage(message);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.className.includes(styles.modalOverlay)) {
      closeCatalogMenu();
    }
  };

  const openCatalogMenu = () => {
    setIsCatalogMenuOpen(true);
  };

  const closeCatalogMenu = () => {
    setIsCatalogMenuOpen(false);
  };

 
  const handleClose = () => {
    onClose();
  };

  
  const socialNetworks = [
    { Icon: FaYoutube, name: "YouTube", link: "#" },
    { Icon: FaFacebook, name: "Facebook", link: "#" },
    { Icon: FaInstagram, name: "Instagram", link: "#" },
    { Icon: FaTelegram, name: "Telegram", link: "#" },
    { Icon: FaPinterest, name: "Pinterest", link: "#" },
    { Icon: FaLinkedin, name: "LinkedIn", link: "#" },
    { Icon: FaTiktok, name: "TikTok", link: "#" },
    { Icon: FaWhatsapp, name: "WhatsApp", link: "#" },
  ];

  return (
    <>
      <div className={`${styles.container} ${isClosing ? styles.closing : ""}`}>
        <div className={styles.header}>
          <img src={LOGO} alt="LOGO" />
          <div>
            <span>
              UA <FaChevronDown className={styles.arrow_icon} />
            </span>
            <span onClick={handleClose} className={styles.close_icon}>
              <FaTimes />
            </span>
          </div>
        </div>
        <div className={styles.center}>
          {successMessage && (
            <div
              style={{ color: "green", textAlign: "center", margin: "10px 0" }}
            >
              {successMessage}
            </div>
          )}
          <div className={styles.ButtonGeneral}>
            <ButtonGeneral
              initialColor="#151515"
              borderColor="#151515"
              text="Каталог товарів"
              width="clamp(16rem, 17vw, 49rem)"
              height="clamp(2rem, 5vw, 4.13rem)"
              onClick={openCatalogMenu}
              textColor="#F2F2F2"
            />
          </div>

          {!isAuthenticated && (
            <div>
              <img src={vector} alt="" className={styles.img_border} />
              <div className={styles.display}>
                <h4>
                  Увійдіть, щоб отримати рекомендації, персональні бонуси і
                  знижки
                </h4>
                <div className={styles.buttonG}>
                  <ButtonGeneral
                    initialColor="#151515"
                    borderColor="#151515"
                    text="Увійти в особистий кабінет"
                    width="clamp(1rem, 12vw, 49rem)"
                    height="clamp(2rem, 5vw, 4.13rem)"
                    textColor="#F2F2F2"
                    onClick={openAuthModal}
                  />
                </div>
              </div>
            </div>
          )}

          <img src={vector} alt="" className={styles.img_border} />

          <div className={styles.links_group_1}>
            <Link to="/home" className={styles.link_item} onClick={handleClose}>
              <FaHome className={styles.icon} />
              <h3>Головна сторінка</h3>
            </Link>
            <Link
              to="/profile"
              className={styles.link_item}
              onClick={handleClose}
            >
              <FaUser className={styles.icon} />
              <h3>Особистий кабінет</h3>
            </Link>
            <Link to="/cart" className={styles.link_item} onClick={handleClose}>
              <FaShoppingCart className={styles.icon} />
              <h3>Кошик</h3>
            </Link>
            <Link
              to="/track_package"
              className={styles.link_item}
              onClick={handleClose}
            >
              <FaBox className={styles.icon} />
              <h3>Відстежити посилку</h3>
            </Link>
            <Link
              to="/chat_with_disfraz"
              className={styles.link_item}
              onClick={handleClose}
            >
              <FaComments className={styles.icon} />
              <h3>Чат з Disfraz</h3>
            </Link>
          </div>

          <img src={vector} alt="" className={styles.img_border} />

          <div className={styles.links_group_2}>
            <h3>Інформація про компанію</h3>
            <Link to="/about_us" onClick={handleClose}>
              Про нас
            </Link>
            <Link to="/terms_of_use" onClick={handleClose}>
              Умови використання сайту
            </Link>
            <Link to="/vacancies" onClick={handleClose}>
              Вакансії
            </Link>
            <Link to="/contacts" onClick={handleClose}>
              Контакти
            </Link>
            <Link to="/all_categories" onClick={handleClose}>
              Всі категорії
            </Link>
          </div>

          <img src={vector} alt="" className={styles.img_border} />

          <div className={styles.links_group_2}>
            <h3>Допомога</h3>
            <Link to="/delivery_and_payment" onClick={handleClose}>
              Доставка та оплата
            </Link>
            <Link to="/credit" onClick={handleClose}>
              Кредит
            </Link>
            <Link to="/warranty" onClick={handleClose}>
              Гарантія
            </Link>
            <Link to="/returns" onClick={handleClose}>
              Повернення товару
            </Link>
          </div>

          <img src={vector} alt="" className={styles.img_border} />

          <div className={styles.links_group_2}>
            <h3>Сервіси</h3>
            <Link to="/bonus_account" onClick={handleClose}>
              Бонусний рахунок
            </Link>
            <Link to="/gift_certificates" onClick={handleClose}>
              Подарункові сертифікати
            </Link>
            <Link to="/disfraz_exchange" onClick={handleClose}>
              Disfraz обмін
            </Link>
            <Link to="/corporate_clients" onClick={handleClose}>
              Корпоративним клієнтам
            </Link>
          </div>

          <img src={vector} alt="" className={styles.img_border} />

          <div className={styles.links_group_2}>
            <h3>Партнерам</h3>
            <Link to="/sell_on_disfraz" onClick={handleClose}>
              Продавати на Disfraz
            </Link>
            <Link to="/cooperation" onClick={handleClose}>
              Співпраця з нами
            </Link>
            <Link to="/franchising" onClick={handleClose}>
              Франчайзинг
            </Link>
            <Link to="/advertising_space_rental" onClick={handleClose}>
              Оренда рекламних площ
            </Link>
          </div>

          <img src={vector} alt="" className={styles.img_border} />

          <div className={styles.loading}>
            <h3>Завантажуйте наші застосунки</h3>
            <div className={styles.app_icons}>
              <a href="#" className={styles.app_link}>
                <FaGooglePlay className={styles.app_icon} />
                <span>Google Play</span>
              </a>
              <a href="#" className={styles.app_link}>
                <FaApple className={styles.app_icon} />
                <span>App Store</span>
              </a>
            </div>
          </div>

          <img src={vector} alt="" className={styles.img_border} />

          <div className={styles.cotial}>
            <h3>Ми в соціальних мережах</h3>
            <div className={styles.imgs}>
              {socialNetworks.map(({ Icon, name, link }, index) => (
                <a
                  key={index}
                  href={link}
                  className={styles.social_link}
                  title={name}
                >
                  <Icon className={styles.social_icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isAuthModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <Authorization onClose={closeAuthModal} />
          </div>
        </div>
      )}

      {isCatalogMenuOpen && (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
          <div className={styles.modalContent}>
            <CatalogMenu onClose={closeCatalogMenu} />
          </div>
        </div>
      )}
    </>
  );
};

export default BurgerMenuLogged;
