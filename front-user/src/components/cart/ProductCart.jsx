import React, { useState } from "react";
import style from "../../style/pages/cart/productCart.module.css";
import { ReactSVG } from "react-svg";
import heart from "../../assets/svg/heartborder.svg";
import discount_icon from "../../assets/svg/discount.svg";
import { useNavigate } from "react-router-dom";

// Компонент картки товару з можливістю додавання в обране
const ProductCart = ({ product, theme }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  // Обробка кліку по іконці серця (додавання в обране)
  const handleClick = (e) => {
    e.stopPropagation();
    setIsClicked(!isClicked);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  // Обробка наведення миші
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Обробка кліку по картці товару з перенаправленням на сторінку товару
  const handleCardClick = () => {
    const formattedTheme = theme
      ? theme.toLowerCase().replace(/\s+/g, "-")
      : "default-theme";
    const productName = product?.name || "default-product";

    // Транслітерація української назви товару в латиницю для URL
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

  // Повідомлення про додавання/видалення з обраного
  const message = isClicked
    ? "Товар додано в обране"
    : "Товар видалено з обраних";

  // Отримання даних товару з перевіркою на наявність
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

  // Перевірка наявності знижки
  const discount =
    productData.discount !== null &&
    productData.discount !== undefined &&
    productData.newPrice !== null;
  const newPrice = discount ? `${productData.newPrice} грн` : null;

  return (
    <div className={style.container} onClick={handleCardClick}>
      <div className={style.container_img}>
        <div className={style.container_imgs}>
          {/* Іконка знижки */}
          {discount && (
            <img
              src={discount_icon}
              alt="Акція"
              className={style.discount_icon}
            />
          )}

          {/* Повідомлення про додавання в обране */}
          <p
            className={`${style.message} ${showMessage ? style.visible : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {showMessage ? message : ""}
          </p>

          {/* Іконка серця для обраного */}
          <ReactSVG
            src={heart}
            className={`${style.icon} ${isClicked ? style.clicked : ""}`}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            wrapper="span"
          />
        </div>

        {/* Зображення товару */}
        {imageUrl ? (
          <img src={imageUrl} alt={productName} className={style.image} />
        ) : (
          <div className={style.image_placeholder}>Немає зображення</div>
        )}
      </div>

      {/* Інформація про товар */}
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
