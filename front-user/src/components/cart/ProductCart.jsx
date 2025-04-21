import React, { useState } from "react";
import style from "../../style/cart/productCart.module.css";
import { ReactSVG } from "react-svg";
import heart from "../../assets/svg/heartborder.svg";
import discount_icon from "../../assets/svg/discount.svg";

import foto from "../../img/newsS/man1.png";
const name = "Назва товару";
const price = "1000";
// const link = "/product";

const ProductCart = ({ discount = false, product }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Для отслеживания наведения

  const handleClick = () => {
    setIsClicked(!isClicked);
    setIsHovered(true); // Показываем текст при клике
  };

  const handleMouseEnter = () => {
    if (isClicked) {
      setIsHovered(true); // Показываем текст при наведении, если сердечко активно
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false); // Скрываем текст при уходе мышки
  };

  const message = isClicked
    ? "Товар додано в обране"
    : "Товар видалено с обраних";

  return (
    <div className={style.container}>
      <div className={style.container_img}>
        <div className={style.container_imgs}>
          {discount && <img src={discount_icon} alt="Акция" />}
          <p
            className={`${style.message} ${isHovered ? style.visible : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {isClicked && isHovered ? message : ""}
          </p>
          <ReactSVG
            src={heart}
            className={`${style.icon} ${isClicked ? style.clicked : ""}`}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            wrapper="span"
          />
        </div>
        <img src={product.photo} alt={name} className={style.image} />
      </div>
      <div className={style.container_text}>
        <p className={style.name}>{product.name}</p>
        <h3 className={style.price}>
          {product.price}
          <span> грн</span>
        </h3>
      </div>
    </div>
  );
};

export default ProductCart;
