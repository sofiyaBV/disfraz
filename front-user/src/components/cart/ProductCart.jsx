import React, { useState } from "react";
import style from "../../style/cart/productCart.module.css";
import { ReactSVG } from "react-svg";
import heart from "../../assets/svg/heartborder.svg";
import discount_icon from "../../assets/svg/discount.svg";
import { useNavigate } from "react-router-dom";

const ProductCart = ({ product, theme }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();
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

  const handleCardClick = () => {
    const formattedTheme = theme
      ? theme.toLowerCase().replace(/\s+/g, "-")
      : "default-theme";
    const productName = product?.name || "default-product";
    const transliteratedName = productName
      .toLowerCase()
      .replace(
        /[а-яіїє]/g,
        (match) =>
          ({
            а: "a",
            б: "b",
            в: "v",
            г: "h",
            ґ: "g",
            д: "d",
            е: "e",
            є: "ye",
            ж: "zh",
            з: "z",
            и: "y",
            і: "i",
            ї: "yi",
            й: "y",
            к: "k",
            л: "l",
            м: "m",
            н: "n",
            о: "o",
            п: "p",
            р: "r",
            с: "s",
            т: "t",
            у: "u",
            ф: "f",
            х: "kh",
            ц: "ts",
            ч: "ch",
            ш: "sh",
            щ: "shch",
            ь: "",
            ю: "yu",
            я: "ya",
          }[match] || match)
      )
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const productUrl = `/${formattedTheme}/${transliteratedName}`;
    navigate(productUrl);
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

  return (
    <div className={style.container} onClick={handleCardClick}>
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
