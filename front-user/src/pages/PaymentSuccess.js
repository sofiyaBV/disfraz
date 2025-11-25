import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../style/pages/payment.module.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/home");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconSuccess}>✓</div>
        <h1 className={styles.title}>Оплата успішна!</h1>
        <p className={styles.message}>
          Дякуємо за ваше замовлення! Ми отримали ваш платіж і обробляємо
          замовлення.
        </p>
        {sessionId && (
          <p className={styles.sessionId}>ID сесії: {sessionId}</p>
        )}
        <p className={styles.redirect}>
          Перенаправлення на головну через {countdown} секунд...
        </p>
        <button className={styles.button} onClick={() => navigate("/home")}>
          Повернутися на головну
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
