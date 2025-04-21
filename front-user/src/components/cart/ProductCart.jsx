import React, { useState } from "react";
import style from "../../style/cart/productCart.module.css";
import { ReactSVG } from "react-svg";
import heart from "../../assets/svg/heartborder.svg";
import discount_icon from "../../assets/svg/discount.svg";

const ProductCart = ({ discount = false, product }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Для отслеживания наведения
  console.log("Product:", product);

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

  // Проверяем, что product.images существует и содержит хотя бы один элемент
  const imageUrl =
    product.images && product.images.length > 0 ? product.images[0].url : null;

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
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} className={style.image} />
        ) : (
          <div className={style.image_placeholder}>Нет изображения</div>
        )}
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
