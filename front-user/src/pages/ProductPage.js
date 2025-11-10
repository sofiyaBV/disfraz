import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ReactSVG } from "react-svg";

import layoutStyles from "../style/products/productPage.module.css";
import imageStyles from "../style/products/imageGallery.module.css";
import detailsStyles from "../style/products/productDetails.module.css";
import similarStyles from "../style/products/similarProducts.module.css";
import commentsStyles from "../style/products/comments.module.css";
import modalStyles from "../style/products/modals.module.css";
import "../style/products/responsive.module.css";

import heart from "../assets/svg/heartborder.svg";
import ButtonGeneral from "../components/buttons/ButtonGeneral";
import CommentSection from "../components/CommentSection";
import icon_monobank from "../img/icon/monobank.png";
import icon_novaPay from "../img/icon/NovaPay.png";
import icon_PrivatBank from "../img/icon/privat.png";
import sizesImg from "../img/sizes.png";
import vector from "../img/Vector.png";
import { useAuth } from "../utils/context/AuthContext";
import dataProvider from "../utils/services/dataProvider";

const styles = {
  ...layoutStyles,
  ...imageStyles,
  ...detailsStyles,
  ...similarStyles,
  ...commentsStyles,
  ...modalStyles,
};

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
  const [showMessage, setShowMessage] = useState(false);
  const [activeInfo, setActiveInfo] = useState(null);
  const [refreshComments, setRefreshComments] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);

  const infoRefs = {
    description: useRef(null),
    delivery: useRef(null),
    payment: useRef(null),
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  useEffect(() => {
    if (cartMessage || cartError) {
      const timer = setTimeout(() => {
        setCartMessage(null);
        setCartError(null);
      }, 3000);
      return () => clearTimeout(timer);
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
        setSelectedSize(targetProduct.attribute.size.split(" ")[0] || "");

        // Получаем похожие товары
        const similar = products
          .filter(
            (item) =>
              item.attribute.theme === targetProduct.attribute.theme &&
              item.id !== targetProduct.id
          )
          .slice(0, 4);
        setSimilarProducts(similar);

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

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    setShowMessage(true);
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
      setRefreshComments((prev) => prev + 1);
    } catch (err) {
      console.error("Помилка при надсиланні коментаря:", err);
      setCartError(
        "Помилка при надсиланні коментаря: " +
          (err.message || "Невідома помилка")
      );
      setCartMessage(null);
    }
  };

  const toggleInfo = (infoType) => {
    if (activeInfo === infoType) {
      setActiveInfo(null);
    } else {
      setActiveInfo(infoType);
    }
  };

  const renderStars = (rating = 4) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`${styles.star} ${
          index < rating ? styles.starFilled : styles.starEmpty
        }`}
      >
        ★
      </span>
    ));
  };

  if (loading) return <div className={styles.loading}>Завантаження...</div>;
  if (error) return <div className={styles.error}>Помилка: {error}</div>;
  if (!product) return <div className={styles.error}>Товар не знайдено</div>;

  const images = product.product.images || [];
  const currentImage =
    images[selectedImageIndex] || (images.length > 0 ? images[0] : null);
  const hasDiscount = product.product.discount > 0 && product.product.newPrice;
  const sizes = product.attribute.size ? product.attribute.size.split(" ") : [];
  const favoriteMessage = isFavorite
    ? "Товар додано в обране"
    : "Товар видалено з обраних";

  return (
    <div>
      <div className={styles.productPage}>
        <div className={styles.imageSection}>
          <div className={styles.thumbnailColumn}>
            {images.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`${product.product.name} ${index + 1}`}
                className={`${styles.thumbnail} ${
                  selectedImageIndex === index ? styles.thumbnailActive : ""
                }`}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
          <div className={styles.mainImageContainer}>
            {currentImage ? (
              <img
                src={currentImage.url}
                alt={product.product.name}
                className={styles.mainImage}
              />
            ) : (
              <div className={styles.imagePlaceholder}>Немає зображення</div>
            )}
          </div>
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.productHeader}>
            <h1 className={styles.title}>{product.product.name}</h1>
            <div className={styles.ratingSection}>
              <div className={styles.stars}>{renderStars()}</div>
              <span className={styles.ratingText}>відгук</span>
              <button
                className={styles.reviewButton}
                onClick={() => setShowReviewModal(true)}
              >
                Написати відгук
              </button>
            </div>
          </div>

          <div className={styles.priceSection}>
            {hasDiscount ? (
              <div className={styles.priceWithDiscount}>
                <span className={styles.newPrice}>
                  {product.product.newPrice} грн
                </span>
                <span className={styles.oldPrice}>
                  {product.product.price} грн
                </span>
                <span className={styles.discountBadge}>
                  -{product.product.discount}%
                </span>
              </div>
            ) : (
              <span className={styles.price}>{product.product.price} грн</span>
            )}
          </div>

          <div className={styles.optionsSection}>
            <div className={styles.sizeSection}>
              <label>Виберіть розмір</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className={styles.sizeSelect}
              >
                <option value="" disabled>
                  Розмір
                </option>
                {sizes.map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <button
              className={styles.sizeTableButton}
              onClick={() => setShowSizeTableModal(true)}
            >
              Таблиця розмірів
            </button>
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
              <ReactSVG src={heart} />
            </button>
          </div>

          <div className={styles.paymentInfo}>
            <p>
              Доступна покупка в кредит:{" "}
              <span className={styles.paymentOption}>
                <img src={icon_novaPay} alt="NovaPay" />
                NovaPay
              </span>
            </p>
            <p>
              Доступна розстрочка:{" "}
              <span className={styles.paymentOption}>
                <img src={icon_PrivatBank} alt="ПриватБанк" />
                ПриватБанк
              </span>{" "}
              <span className={styles.paymentOption}>
                <img src={icon_monobank} alt="Monobank" />
                Monobank
              </span>
            </p>
          </div>

          <div className={styles.informations}>
            <div
              className={`${styles.infoTitle} ${
                activeInfo === "description" ? styles.infoTitleActive : ""
              }`}
              onClick={() => toggleInfo("description")}
              ref={infoRefs.description}
            >
              ПОВНИЙ ОПИС ТОВАРУ
              <span className={styles.infoIcon}>
                {activeInfo === "description" ? "−" : "+"}
              </span>
            </div>
            <div
              className={`${styles.infoContent} ${
                activeInfo === "description" ? styles.infoContentActive : ""
              }`}
            >
              <h3>Характеристика та опис</h3>
              <p>{product.product.description}</p>
              <div className={styles.productDescriptionWrapper}>
                <div className={styles.productDescriptionLabels}>
                  <p>Артикул:</p>
                  <p>Тематика:</p>
                  <p>Розмір:</p>
                  <p>Матеріали:</p>
                  <p>Частина тіла:</p>
                  <p>Чи є комплектом:</p>
                </div>
                <div className={styles.productDescriptionValues}>
                  <p>{product.id}</p>
                  <p>{product.attribute.theme}</p>
                  <p>{product.attribute.size}</p>
                  <p>{product.attribute.material}</p>
                  <p>{product.attribute.bodyPart}</p>
                  <p>{product.attribute.isSet ? "Так" : "Ні"}</p>
                </div>
              </div>
              <p>{product.attribute.description}</p>
            </div>

            <div
              className={`${styles.infoTitle} ${
                activeInfo === "delivery" ? styles.infoTitleActive : ""
              }`}
              onClick={() => toggleInfo("delivery")}
              ref={infoRefs.delivery}
            >
              ДОСТАВКА ТА ПОВЕРНЕННЯ
              <span className={styles.infoIcon}>
                {activeInfo === "delivery" ? "−" : "+"}
              </span>
            </div>
            <div
              className={`${styles.infoContent} ${
                activeInfo === "delivery" ? styles.infoContentActive : ""
              }`}
            >
              {product.product.delivery_and_returns}
            </div>

            <div
              className={`${styles.infoTitle} ${
                activeInfo === "payment" ? styles.infoTitleActive : ""
              }`}
              onClick={() => toggleInfo("payment")}
              ref={infoRefs.payment}
            >
              ОПЛАТА
              <span className={styles.infoIcon}>
                {activeInfo === "payment" ? "−" : "+"}
              </span>
            </div>
            <div
              className={`${styles.infoContent} ${
                activeInfo === "payment" ? styles.infoContentActive : ""
              }`}
            >
              {product.product.payment_info}
            </div>
          </div>
        </div>
      </div>

      {/* Похожие товары */}
      {similarProducts.length > 0 && (
        <div className={styles.similarProductsSection}>
          <h2 className={styles.similarProductsTitle}>Схожі товари</h2>
          <div className={styles.similarProductsGrid}>
            {similarProducts.map((similarProduct) => (
              <div
                key={similarProduct.id}
                className={styles.similarProductCard}
              >
                <div className={styles.similarProductImage}>
                  {similarProduct.product.images &&
                  similarProduct.product.images.length > 0 ? (
                    <img
                      src={similarProduct.product.images[0].url}
                      alt={similarProduct.product.name}
                    />
                  ) : (
                    <div className={styles.noImagePlaceholder}>Немає фото</div>
                  )}
                  <button className={styles.similarProductFavorite}>
                    <ReactSVG src={heart} />
                  </button>
                </div>
                <div className={styles.similarProductInfo}>
                  <h3 className={styles.similarProductName}>
                    {similarProduct.product.name}
                  </h3>
                  <div className={styles.similarProductPrice}>
                    {similarProduct.product.newPrice ? (
                      <>
                        <span className={styles.similarNewPrice}>
                          {similarProduct.product.newPrice} грн
                        </span>
                        <span className={styles.similarOldPrice}>
                          {similarProduct.product.price} грн
                        </span>
                      </>
                    ) : (
                      <span className={styles.similarPrice}>
                        {similarProduct.product.price} грн
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section_2}>
        <h2>ВІДГУКИ</h2>
        <img src={vector} alt="" className={styles.img_vector} />
      </div>

      <div className={styles.comment_section}>
        <div className={styles.comment_section2}>
          <CommentSection
            productAttributeId={product.id}
            refresh={refreshComments}
            setShowReviewModal={setShowReviewModal}
            showReviewModal={showReviewModal}
            reviewContent={reviewContent}
            setReviewContent={setReviewContent}
            handleSubmitComment={handleSubmitComment}
          />
        </div>
        <div>
          <ButtonGeneral
            text="Надіслати"
            onClick={() => setShowReviewModal(true)}
          />
        </div>
      </div>

      {/* Модальные окна */}
      {showReviewModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Написати відгук</h2>
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="Ваш відгук..."
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

      {showSizeTableModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.sizeTableModal}>
            <img
              src={sizesImg}
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

      <div className={styles.messageContainer}>
        {cartMessage && <div className={styles.cartMessage}>{cartMessage}</div>}
        {cartError && <div className={styles.cartError}>{cartError}</div>}
        {showMessage && (
          <div className={styles.favoriteMessage}>{favoriteMessage}</div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
