// BurgerMenuLogged.js
import React, { useState } from "react";
import styles from "../../style/burgerMenu.module.css";
import ButtonGeneral from "../buttons/ButtonGeneral";
import Authorization from "../registrations/Authorization";
import { useAuth } from "../../utils/AuthContext";

import LOGO from "../../assets/LOGO.png";
import arrow from "../../assets/arrow.png";
import vector from "../../img/Vector.png";
import profile from "../../assets/profile.png";
import message from "../../assets/messages-3.png";
import box from "../../assets/box-search.png";
import shop from "../../assets/shopping-cart.png";
import AppStore from "../../assets/footer/app_download_04.png";
import googlePlay from "../../assets/footer/app_download_11.png";
import youtube from "../../img/icon/youtube.png";
import whatsapp from "../../img/icon/whatsapp.png";
import tiktok from "../../img/icon/tiktok.png";
import linkedin from "../../img/icon/linkedin.png";
import pinterest from "../../img/icon/pinterest.png";
import telegram from "../../img/icon/telegram.png";
import inst from "../../img/icon/instagram.png";
import facebook from "../../img/icon/facebook.png";

const BurgerMenuLogged = ({ onClose }) => {
  const { isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

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

  // Временная функция для сброса состояния
  const resetAuthState = () => {
    localStorage.removeItem("authToken");
    logout();
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <img src={LOGO} alt="LOGO" />
          <div>
            <span>
              UA <img src={arrow} alt="arrow" />
            </span>
            <span onClick={onClose} className={styles.close_icon}>
              ✕
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
              link="/categories"
              textColor="#F2F2F2"
            />
          </div>
          {/* Временная кнопка для сброса состояния */}
          {/* <div style={{ margin: "10px 0" }}>
            <ButtonGeneral
              initialColor="#ff0000"
              borderColor="#ff0000"
              text="Сбросить авторизацию (для теста)"
              width="clamp(16rem, 17vw, 49rem)"
              height="clamp(2rem, 5vw, 4.13rem)"
              textColor="#ffffff"
              onClick={resetAuthState}
            />
          </div> */}
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
            <span>
              <img src={profile} alt="profile" />
              <h3>Особистий кабінет</h3>
            </span>
            <span>
              <img src={shop} alt="shop" />
              <h3>Кошик</h3>
            </span>
            <span>
              <img src={box} alt="box" />
              <h3>Відстежити посилку</h3>
            </span>
            <span>
              <img src={message} alt="message" />
              <h3>Чат з Disfraz</h3>
            </span>
            {isAuthenticated && (
              <span onClick={logout} style={{ cursor: "pointer" }}>
                <img src={profile} alt="logout" />
                <h3>Вийти</h3>
              </span>
            )}
          </div>
          <img src={vector} alt="" className={styles.img_border} />
          <div className={styles.links_group_2}>
            <h3>Інформація про компанію</h3>
            <p>Про нас</p>
            <p>Умови використання сайту</p>
            <p>Вакансії</p>
            <p>Контакти</p>
            <p>Всі категорії</p>
          </div>
          <img src={vector} alt="" className={styles.img_border} />
          <div className={styles.links_group_2}>
            <h3>Допомога</h3>
            <p>Доставка та оплата</p>
            <p>Кредит</p>
            <p>Гарантія</p>
            <p>Повернення товару</p>
          </div>
          <img src={vector} alt="" className={styles.img_border} />
          <div className={styles.links_group_2}>
            <h3>Сервіси</h3>
            <p>Бонусний рахунок</p>
            <p>Подарункові сертифікати</p>
            <p>Disfraz обмін</p>
            <p>Корпоративним клієнтам</p>
          </div>
          <img src={vector} alt="" className={styles.img_border} />
          <div className={styles.links_group_2}>
            <h3>Партнерам</h3>
            <p>Продавати на Disfraz</p>
            <p>Співпраця з нами</p>
            <p>Франчайзинг</p>
            <p>Оренда рекламних площ</p>
          </div>
          <img src={vector} alt="" className={styles.img_border} />
          <div className={styles.loading}>
            <h3>Завантажуйте наші застосунки</h3>
            <div>
              <img src={googlePlay} alt="Google Play" />
              <img src={AppStore} alt="App Store" />
            </div>
          </div>
          <img src={vector} alt="" className={styles.img_border} />
          <div className={styles.cotial}>
            <h3>Ми в соціальних мережах</h3>
            <div className={styles.imgs}>
              <img src={youtube} alt="" />
              <img src={facebook} alt="" />
              <img src={inst} alt="" />
              <img src={telegram} alt="" />
              <img src={pinterest} alt="" />
              <img src={linkedin} alt="" />
              <img src={tiktok} alt="" />
              <img src={whatsapp} alt="" />
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
    </>
  );
};

export default BurgerMenuLogged;
