import React, { useState } from "react";
import style from "../../style/cart/productCart.module.css";
import { ReactSVG } from "react-svg";
import heart from "../../assets/svg/heartborder.svg";
import discount_icon from "../../assets/svg/discount.svg";

const ProductCart = ({ product }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const message = isClicked
    ? "Товар додано в обране"
    : "Товар видалено з обраних";

  const productData = product || {};
  const imageUrl =
    productData.images && productData.images.length > 0
      ? productData.images[0].url
      : null;
  const productName = productData.name || "Без назви";
  const basePrice =
    productData.price !== null && productData.price !== undefined
      ? `${productData.price} грн`
      : null;
  const discount =
    productData.discount !== null &&
    productData.discount !== undefined &&
    productData.newPrice !== null;
  const newPrice = discount ? `${productData.newPrice} грн` : null;

  console.log("ProductCart product:", product);

  return (
    <div className={style.container}>
      <div className={style.container_img}>
        <div className={style.container_imgs}>
          {discount && (
            <img
              src={discount_icon}
              alt="Акція"
              className={style.discount_icon}
            />
          )}
          <p
            className={`${style.message} ${showMessage ? style.visible : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {showMessage ? message : ""}
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
          <img src={imageUrl} alt={productName} className={style.image} />
        ) : (
          <div className={style.image_placeholder}>Немає зображення</div>
        )}
      </div>
      <div className={style.container_text}>
        <p className={style.name}>{productName}</p>
        {basePrice ? (
          <h3 className={style.price}>
            {discount ? (
              <>
                <span className={style.newPrice}>{newPrice}</span>
                <span className={style.oldPrice}>{basePrice}</span>
              </>
            ) : (
              <span className={style.basePrice}>{basePrice}</span>
            )}
          </h3>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCart;
