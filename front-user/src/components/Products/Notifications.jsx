import styles from "../../style/pages/products/modals.module.css";

const Notifications = ({ success, error, favoriteMessage }) => {
  if (!success && !error && !favoriteMessage) return null;

  return (
    <div className={styles.messageContainer}>
      {success && <div className={styles.cartMessage}>{success}</div>}
      {error && <div className={styles.cartError}>{error}</div>}
      {favoriteMessage && (
        <div className={styles.favoriteMessage}>{favoriteMessage}</div>
      )}
    </div>
  );
};

export default Notifications;
