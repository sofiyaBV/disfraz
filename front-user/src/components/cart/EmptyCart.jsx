import { useNavigate } from "react-router-dom";
import styles from "../../style/pages/cart/emptyCart.module.css";
import ButtonGeneral from "../buttons/ButtonGeneral";

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.emptyCart}>
      <h2 className={styles.title}>Ваш кошик порожній</h2>
      <p className={styles.text}>Додайте товари, щоб оформити замовлення</p>
      <ButtonGeneral
        text="Перейти до каталогу"
        textColor="white"
        onClick={() => navigate("/home")}
      />
    </div>
  );
};

export default EmptyCart;
