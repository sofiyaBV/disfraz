// src/components/cart/ProductCart.js
import React, { useState } from "react";
import style from "../../style/cart/productCart.module.css";
import { ReactSVG } from "react-svg";
import heart from "../../assets/svg/heartborder.svg";
import discount_icon from "../../assets/svg/discount.svg";

const ProductCart = ({ discount = false, product }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  console.log("Product in ProductCart:", product);

  const handleClick = () => {
    setIsClicked(!isClicked);
    setIsHovered(true);
  };

  const handleMouseEnter = () => {
    if (isClicked) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const message = isClicked
    ? "Товар додано в обране"
    : "Товар видалено с обраних";

  // Извлекаем данные из структуры API
  const productData = product.product || product; // Если product уже содержит данные на верхнем уровне
  const imageUrl =
    productData.images && productData.images.length > 0
      ? productData.images[0].url
      : null;

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
          <img src={imageUrl} alt={productData.name} className={style.image} />
        ) : (
          <div className={style.image_placeholder}>Нет изображения</div>
        )}
      </div>
      <div className={style.container_text}>
        <p className={style.name}>{productData.name}</p>
        <h3 className={style.price}>
          {productData.price}
          <span> грн</span>
        </h3>
      </div>
    </div>
  );
};

export default ProductCart;
