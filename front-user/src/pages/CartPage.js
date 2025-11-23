import { useNavigate } from "react-router-dom";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyCart from "../components/cart/EmptyCart";
import useCartData from "../utils/hooks/useCartData";
import styles from "../style/cart/cartPage.module.css";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    loading,
    error,
    totalItems,
    totalDiscount,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartData();

  const handleContinueShopping = () => {
    navigate("/home");
  };

  if (loading) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  // Помилку показуємо тільки якщо є товари
  if (error) {
    return <div className={styles.error}>Помилка: {error}</div>;
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.breadcrumb}>
        <span
          className={styles.breadcrumbLink}
          onClick={() => navigate("/home")}
        >
          КОШИК
        </span>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>ВАШ КОШИК</h1>
        <button className={styles.clearBtn} onClick={clearCart}>
          Очистити кошик
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.itemsList}>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        <aside className={styles.sidebar}>
          <CartSummary
            totalItems={totalItems}
            totalDiscount={totalDiscount}
            totalPrice={totalPrice}
            onClearCart={handleContinueShopping}
          />
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
