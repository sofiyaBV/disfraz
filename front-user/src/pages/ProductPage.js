import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ReactSVG } from "react-svg";

import layoutStyles from "../style/products/productPage.module.css";
import detailsStyles from "../style/products/productDetails.module.css";
import commentsStyles from "../style/products/comments.module.css";
import modalStyles from "../style/products/modals.module.css";
import "../style/products/responsive.module.css";

import heart from "../assets/svg/heartborder.svg";
import ButtonGeneral from "../components/buttons/ButtonGeneral";
import CommentSection from "../components/CommentSection";
import ImageGallery from "../components/Products/ImageGallery";
import SimilarProducts from "../components/Products/SimilarProducts";
import Notifications from "../components/Products/Notifications";
import icon_monobank from "../img/icon/monobank.png";
import icon_novaPay from "../img/icon/NovaPay.png";
import icon_PrivatBank from "../img/icon/privat.png";
import sizesImg from "../img/sizes.png";
import vector from "../img/Vector.png";

import useProductDetails from "../utils/hooks/useProductDetails";
import useCart from "../utils/hooks/useCart";
import useComments from "../utils/hooks/useComments";
import useNotifications from "../utils/hooks/useNotifications";

const styles = {
  ...layoutStyles,
  ...detailsStyles,
  ...commentsStyles,
  ...modalStyles,
};

const ProductPage = () => {
  const { theme, productName } = useParams();

  // Хуки
  const { product, similarProducts, loading, error } = useProductDetails(
    theme,
    productName
  );
  const { addToCart } = useCart();
  const { submitComment } = useComments(product?.id);
  const notifications = useNotifications(3000);

  // Локальний стейт
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSizeTableModal, setShowSizeTableModal] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [showFavoriteMessage, setShowFavoriteMessage] = useState(false);
  const [activeInfo, setActiveInfo] = useState(null);
  const [refreshComments, setRefreshComments] = useState(0);

  const infoRefs = {
    description: useRef(null),
    delivery: useRef(null),
    payment: useRef(null),
  };

  // Розмір за замовчуванням
  useEffect(() => {
    if (product?.attribute?.size) {
      setSelectedSize(product.attribute.size.split(" ")[0]);
    }
  }, [product]);

  // Автоховання повідомлення обраного
  useEffect(() => {
    if (showFavoriteMessage) {
      const timer = setTimeout(() => setShowFavoriteMessage(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showFavoriteMessage]);

  const handleAddToCart = async () => {
    const success = await addToCart(product.id, quantity);
    if (success) {
      notifications.showSuccess("Товар додано до кошика!");
    } else {
      notifications.showError(
        "Будь ласка, увійдіть в акаунт для додавання в кошик!"
      );
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    setShowFavoriteMessage(true);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleSubmitComment = async () => {
    const success = await submitComment(reviewContent, {
      onSuccess: (msg) => {
        notifications.showSuccess(msg);
        setShowReviewModal(false);
        setReviewContent("");
        setRefreshComments((prev) => prev + 1);
      },
      onError: (msg) => notifications.showError(msg),
    });
  };

  const toggleInfo = (infoType) => {
    setActiveInfo(activeInfo === infoType ? null : infoType);
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

  // Стани завантаження
  if (loading) return <div className={styles.loading}>Завантаження...</div>;
  if (error) return <div className={styles.error}>Помилка: {error}</div>;
  if (!product) return <div className={styles.error}>Товар не знайдено</div>;

  const images = product.product.images || [];
  const hasDiscount = product.product.discount > 0 && product.product.newPrice;
  const sizes = product.attribute.size ? product.attribute.size.split(" ") : [];
  const favoriteMessage = isFavorite
    ? "Товар додано в обране"
    : "Товар видалено з обраних";

  return (
    <div>
      <div className={styles.productPage}>
        <ImageGallery images={images} productName={product.product.name} />

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

      <SimilarProducts products={similarProducts} />

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

      {/* Модалка відгуку */}
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

      {/* Модалка розмірів */}
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

      <Notifications
        success={notifications.success}
        error={notifications.error}
        favoriteMessage={showFavoriteMessage ? favoriteMessage : null}
      />
    </div>
  );
};

export default ProductPage;
