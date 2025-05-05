import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dataProvider from "../utils/dataProvider";
import styles from "../../src/style/pagesStyle/productPage.module.css";
import ButtonGeneral from "../components/buttons/ButtonGeneral";
import { useAuth } from "../utils/AuthContext";

const ProductPage = () => {
  const { theme, productName } = useParams();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSizeTableModal, setShowSizeTableModal] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [cartMessage, setCartMessage] = useState(null);
  const [cartError, setCartError] = useState(null);

  console.log("isAuthenticated in ProductPage:", isAuthenticated);

  // Автоматичне зникнення повідомлень через 3 секунди
  useEffect(() => {
    if (cartMessage || cartError) {
      const timer = setTimeout(() => {
        setCartMessage(null);
        setCartError(null);
      }, 3000); // 3 секунди

      return () => clearTimeout(timer); // Очищення таймера при зміні стану
    }
  }, [cartMessage, cartError]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await dataProvider.getList("product-attributes", {
          filter: {},
        });
        const products = response.data || [];

        const targetProduct = products.find((item) => {
          const transliteratedName = item.product.name
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
          return (
            transliteratedName === productName &&
            item.attribute.theme.toLowerCase().replace(/\s+/g, "-") === theme
          );
        });

        if (!targetProduct) {
          throw new Error("Товар не знайдено");
        }

        setProduct(targetProduct);
        setSelectedSize(targetProduct.attribute.size.split(",")[0] || "");
        setLoading(false);
      } catch (err) {
        setError(err.message || "Помилка при завантаженні товару");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [theme, productName]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setCartError("Будь ласка, увійдіть в акаунт для додавання в кошик!");
      return;
    }
    try {
      const payload = {
        productAttributeId: product.id,
        quantity: quantity,
      };
      const response = await dataProvider.create("cart", { data: payload });
      console.log("Успішно додано до кошика:", response);
      setCartMessage("Товар додано до кошика!");
      setCartError(null);
    } catch (err) {
      console.error("Помилка при додаванні до кошика:", err);
      setCartError(
        "Помилка при додаванні до кошика: " +
          (err.message || "Невідома помилка")
      );
      setCartMessage(null);
    }
  };

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      setCartError("Будь ласка, увійдіть в акаунт для додавання до обраного!");
      return;
    }
    setIsFavorite(!isFavorite);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      setCartError("Будь ласка, увійдіть в акаунт для надсилання коментаря!");
      return;
    }
    try {
      const payload = {
        productAttributeId: product.id,
        content: reviewContent,
      };
      await dataProvider.create("comments", { data: payload });
      setCartMessage("Коментар надіслано!");
      setCartError(null);
      setShowReviewModal(false);
      setReviewContent("");
    } catch (err) {
      console.error("Помилка при надсиланні коментаря:", err);
      setCartError(
        "Помилка при надсиланні коментаря: " +
          (err.message || "Невідома помилка")
      );
      setCartMessage(null);
    }
  };

  if (loading) return <div className={styles.loading}>Завантаження...</div>;
  if (error) return <div className={styles.error}>Помилка: {error}</div>;
  if (!product) return <div className={styles.error}>Товар не знайдено</div>;

  const imageUrl =
    product.product.images && product.product.images.length > 0
      ? product.product.images[0].url
      : null;
  const hasDiscount =
    product.product.discount !== null &&
    product.product.discount !== undefined &&
    product.product.newPrice !== null;
  const sizes = product.attribute.size ? product.attribute.size.split(",") : [];
  const sizeTableImage =
    "https://via.placeholder.com/600x400?text=Таблиця+розмірів";

  return (
    <div className={styles.productPage}>
      <div className={styles.imageSection}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.product.name}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder}>Немає зображення</div>
        )}
        {product.product.images && product.product.images.length > 1 && (
          <div className={styles.thumbnailGallery}>
            {product.product.images.slice(1).map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`${product.product.name} thumbnail ${index + 1}`}
                className={styles.thumbnail}
              />
            ))}
          </div>
        )}
      </div>
      <div className={styles.detailsSection}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{product.product.name}</h1>
          <button
            className={styles.reviewButton}
            onClick={() => setShowReviewModal(true)}
          >
            Написати коментар
          </button>
        </div>
        <div className={styles.priceSection}>
          {hasDiscount ? (
            <>
              <span className={styles.newPrice}>
                {product.product.newPrice} грн
              </span>
              <span className={styles.oldPrice}>
                {product.product.price} грн
              </span>
              <span className={styles.discount}>
                -{product.product.discount}%
              </span>
            </>
          ) : (
            <span className={styles.price}>{product.product.price} грн</span>
          )}
        </div>
        <div className={styles.selectSection}>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className={styles.sizeSelect}
          >
            <option value="" disabled>
              Виберіть розмір
            </option>
            {sizes.map((size, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))}
          </select>
          <select
            className={styles.sizeTable}
            onChange={(e) => {
              if (e.target.value === "sizeTable") {
                setShowSizeTableModal(true);
              }
            }}
            onClick={() => setShowSizeTableModal(true)}
          >
            <option value="sizeTable">Таблиця розмірів</option>
          </select>
        </div>
        <div className={styles.quantitySection}>
          <button
            onClick={() => handleQuantityChange(-1)}
            className={styles.quantityButton}
          >
            –
          </button>
          <span className={styles.quantity}>{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className={styles.quantityButton}
          >
            +
          </button>
        </div>
        <div className={styles.actionButtons}>
          <ButtonGeneral
            textColor="white"
            text="Додати до кошика"
            onClick={handleAddToCart}
            className={styles.addToCartButton}
          />
          <button
            onClick={handleFavoriteClick}
            className={`${styles.favoriteButton} ${
              isFavorite ? styles.favoriteActive : ""
            }`}
          >
            ♥
          </button>
        </div>
        <div className={styles.paymentInfo}>
          <p>
            Доступна покупка в кредит:{" "}
            <span className={styles.paymentOption}>NovaPay</span>
          </p>
          <p>
            Доступна розстрочка:{" "}
            <span className={styles.paymentOption}>ПриватБанк</span>{" "}
            <span className={styles.paymentOption}>Monobank</span>
          </p>
        </div>
      </div>

      {/* Модальное окно для комментария */}
      {showReviewModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Написати коментар</h2>
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="Ваш коментар..."
              className={styles.reviewTextarea}
            />
            <div className={styles.modalButtons}>
              <button
                onClick={handleSubmitComment}
                className={styles.submitReviewButton}
              >
                Надіслати
              </button>
              <button
                onClick={() => setShowReviewModal(false)}
                className={styles.closeModalButton}
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для таблицы размеров */}
      {showSizeTableModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.sizeTableModal}>
            <img
              src={sizeTableImage}
              alt="Таблиця розмірів"
              className={styles.sizeTableImage}
            />
            <button
              onClick={() => setShowSizeTableModal(false)}
              className={styles.closeModalButton}
            >
              Закрити
            </button>
          </div>
        </div>
      )}

      {/* Отображение сообщений внизу экрана */}
      <div className={styles.messageContainer}>
        {cartMessage && <div className={styles.cartMessage}>{cartMessage}</div>}
        {cartError && <div className={styles.cartError}>{cartError}</div>}
      </div>
    </div>
  );
};

export default ProductPage;
