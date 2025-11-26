import { useState } from "react";
import styles from "../../style/pages/cart/cartSummary.module.css";
import ButtonGeneral from "../buttons/ButtonGeneral";
import dataProvider from "../../utils/services/dataProvider";
import { useAuth } from "../../utils/context/AuthContext";

const CartSummary = ({
  totalItems,
  totalDiscount,
  totalPrice,
  onClearCart,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert("Будь ласка, увійдіть в акаунт для оформлення замовлення!");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const orderData = {
        customerName: user?.name || user?.email || "Користувач",
        customerEmail: user?.email || "",
        customerPhone: user?.phone || "",
        deliveryAddress: user?.address || "Адреса не вказана",
        deliveryMethod: "Нова Пошта - відділення",
      };

      const orderResponse = await dataProvider.create("orders", {
        data: orderData,
      });

      const orderId = orderResponse.data.id;

      const checkoutResponse = await dataProvider.create(
        "payment/create-checkout-session",
        {
          data: {
            orderId,
            successUrl: `${window.location.origin}/payment/success`,
            cancelUrl: `${window.location.origin}/payment/cancel`,
          },
        }
      );

      if (checkoutResponse.data.url) {
        window.location.href = checkoutResponse.data.url;
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Checkout error:", err);
      }
      setError(err.message || "Помилка при оформленні замовлення");
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.summary}>
      <div className={styles.header}>
        <span className={styles.totalLabel}>ВСЬОГО :</span>
        <span className={styles.totalItems}>{totalItems} товарів</span>
        <button className={styles.closeBtn} onClick={onClearCart} type="button">×</button>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>ЗНИЖКА :</span>
        <span className={styles.value}>{totalDiscount.toFixed(0)} ₴</span>
      </div>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>ЗАГАЛОМ :</span>
        <span className={styles.totalValue}>{totalPrice.toFixed(0)} ₴</span>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        <button className={styles.continueBtn} onClick={onClearCart}>
          ПРОДОВЖИТИ ПОКУПКИ
        </button>
        <ButtonGeneral
          text={isProcessing ? "ОБРОБКА..." : "ОФОРМИТИ ЗАМОВЛЕННЯ"}
          textColor="white"
          className={styles.checkoutBtn}
          onClick={handleCheckout}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

export default CartSummary;
