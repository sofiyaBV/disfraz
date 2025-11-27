import { useState } from "react";
import { ReactSVG } from "react-svg";
import heart from "../../assets/svg/heartborder.svg";
import styles from "../../style/pages/cart/cartItem.module.css";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const product = item.productAttribute?.product;
  const attribute = item.productAttribute?.attribute;

  if (!product) return null;

  const imageUrl = product.images?.[0]?.url || null;
  const hasDiscount = product.discount > 0 && product.newPrice;
  const unitPrice = hasDiscount ? product.newPrice : product.price;

  const handleQuantityChange = (delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={styles.cartItem}>
      {/* Зображення */}
      <div className={styles.imageContainer}>
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>Немає фото</div>
        )}
      </div>

      {/* Інформація про товар */}
      <div className={styles.info}>
        <h3 className={styles.theme}>{attribute?.theme || "Без теми"}</h3>
        <p className={styles.name}>{product.name}</p>

        <div className={styles.details}>
          <p>
            <span className={styles.label}>Ціна:</span>
            <span className={styles.value}>{unitPrice} грн</span>
            {hasDiscount && (
              <span className={styles.oldPrice}>{product.price}</span>
            )}
          </p>
          <p>
            <span className={styles.label}>Продавець:</span>
            <span className={styles.value}>DISFRAZ</span>
          </p>
          <p>
            <span className={styles.label}>Розмір:</span>
            <span className={styles.value}>{attribute?.size || "—"}</span>
          </p>
          {hasDiscount && (
            <p>
              <span className={styles.label}>Знижка:</span>
              <span className={styles.discount}>
                {Math.round((product.price - product.newPrice) * item.quantity)}{" "}
                грн
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Кількість */}
      <div className={styles.quantitySection}>
        <button
          className={styles.quantityBtn}
          onClick={() => handleQuantityChange(-1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className={styles.quantity}>{item.quantity}</span>
        <button
          className={styles.quantityBtn}
          onClick={() => handleQuantityChange(1)}
        >
          +
        </button>
      </div>

      {/* Ціна */}
      <div className={styles.priceSection}>
        <span className={styles.totalPrice}>
          {Number(item.price).toFixed(2)} грн
        </span>
      </div>

      {/* Дії */}
      <div className={styles.actions}>
        <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>
          Видалити ×
        </button>
        <button
          className={`${styles.favoriteBtn} ${
            isFavorite ? styles.favoriteActive : ""
          }`}
          onClick={handleFavoriteClick}
        >
          Відкласти
          <ReactSVG src={heart} className={styles.heartIcon} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
