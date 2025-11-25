import { useNavigate } from "react-router-dom";
import styles from "../style/pages/payment.module.css";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconCancel}>×</div>
        <h1 className={styles.title}>Оплата скасована</h1>
        <p className={styles.message}>
          Ви скасували оплату. Ваше замовлення не було оплачено.
        </p>
        <p className={styles.info}>
          Якщо у вас виникли проблеми з оплатою, спробуйте ще раз або
          зв'яжіться з нашою службою підтримки.
        </p>
        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={() => navigate("/cart")}
          >
            Повернутися до кошика
          </button>
          <button
            className={styles.buttonSecondary}
            onClick={() => navigate("/home")}
          >
            На головну
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
