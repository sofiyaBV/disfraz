import { useState } from "react";
import styles from "../../style/pages/cart/cartSummary.module.css";
import ButtonGeneral from "../buttons/ButtonGeneral";
import dataProvider from "../../utils/services/dataProvider";
import { useAuth } from "../../utils/context/AuthContext";
import { validateUkrainianPhone, normalizeUkrainianPhone } from "../../utils/helpers/validation";

const CartSummary = ({
  totalItems,
  totalDiscount,
  totalPrice,
  onClearCart,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert("Будь ласка, увійдіть в акаунт для оформлення замовлення!");
      return;
    }

    if (totalItems === 0) {
      setError("Ваш кошик порожній");
      return;
    }

    // Перевірка наявності номера телефону
    if (!user?.phone && !phoneNumber) {
      setError("Для оформлення замовлення необхідно вказати номер телефону");
      setShowPhoneInput(true);
      return;
    }

    // Перевірка валідності номера телефону з профілю
    if (user?.phone && !phoneNumber && !validateUkrainianPhone(user.phone)) {
      setError("Номер телефону в профілі має некоректний формат. Будь ласка, введіть коректний номер");
      setShowPhoneInput(true);
      return;
    }

    // Валідація номера телефону, якщо користувач ввів його
    if (phoneNumber && !validateUkrainianPhone(phoneNumber)) {
      setPhoneError("Некоректний формат номера телефону. Використовуйте формат: +380XXXXXXXXX або 0XXXXXXXXX");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPhoneError("");

    try {
      const finalPhone = user?.phone || phoneNumber;
      // Нормалізуємо номер телефону до формату +380XXXXXXXXX
      const normalizedPhone = normalizeUkrainianPhone(finalPhone);

      const orderData = {
        customerName: user?.name || user?.email || "Користувач",
        customerEmail: user?.email || "",
        customerPhone: normalizedPhone,
        deliveryAddress: user?.address || "Адреса не вказана",
        deliveryMethod: "Нова Пошта - відділення",
      };

      const orderResponse = await dataProvider.create("orders", {
        data: orderData,
      });

      if (!orderResponse || !orderResponse.data || !orderResponse.data.id) {
        throw new Error("Не вдалося створити замовлення");
      }

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

      if (!checkoutResponse || !checkoutResponse.data || !checkoutResponse.data.url) {
        throw new Error("Не вдалося створити сесію оплати");
      }

      const redirectUrl = checkoutResponse.data.url;

      try {
        const url = new URL(redirectUrl);
        if (url.hostname !== 'checkout.stripe.com') {
          throw new Error("Небезпечний URL для переходу");
        }
        window.location.href = redirectUrl;
      } catch (urlError) {
        throw new Error("Отримано некоректний URL для оплати");
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

      {showPhoneInput && (
        <div className={styles.phoneInputContainer}>
          <label htmlFor="phone" className={styles.phoneLabel}>
            Номер телефону для оформлення замовлення:
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setPhoneError("");
              setError(null);
            }}
            className={phoneError ? styles.phoneInputError : styles.phoneInput}
            placeholder="+380XXXXXXXXX або 0XXXXXXXXX"
            disabled={isProcessing}
          />
          {phoneError && <div className={styles.error}>{phoneError}</div>}
        </div>
      )}

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
