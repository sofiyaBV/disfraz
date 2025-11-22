import styles from "../../style/cart/cartSummary.module.css";
import ButtonGeneral from "../buttons/ButtonGeneral";

const CartSummary = ({
  totalItems,
  totalDiscount,
  totalPrice,
  onClearCart,
}) => {
  return (
    <div className={styles.summary}>
      <div className={styles.header}>
        <span className={styles.totalLabel}>ВСЬОГО :</span>
        <span className={styles.totalItems}>{totalItems} товарів</span>
        <button className={styles.closeBtn}>×</button>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>ЗНИЖКА :</span>
        <span className={styles.value}>{totalDiscount.toFixed(0)} ₴</span>
      </div>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>ЗАГАЛОМ :</span>
        <span className={styles.totalValue}>{totalPrice.toFixed(0)} ₴</span>
      </div>

      <div className={styles.actions}>
        <button className={styles.continueBtn} onClick={onClearCart}>
          ПРОДОВЖИТИ ПОКУПКИ
        </button>
        <ButtonGeneral
          text="ОФОРМИТИ ЗАМОВЛЕННЯ"
          textColor="white"
          className={styles.checkoutBtn}
        />
      </div>
    </div>
  );
};

export default CartSummary;
