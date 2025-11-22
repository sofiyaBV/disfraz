import { ReactSVG } from "react-svg";
import heart from "../../assets/svg/heartborder.svg";
import styles from "../../style/products/similarProducts.module.css";

const SimilarProducts = ({ products = [] }) => {
  if (products.length === 0) return null;

  return (
    <div className={styles.similarProductsSection}>
      <h2 className={styles.similarProductsTitle}>Схожі товари</h2>
      <div className={styles.similarProductsGrid}>
        {products.map((item) => (
          <div key={item.id} className={styles.similarProductCard}>
            <div className={styles.similarProductImage}>
              {item.product.images?.length > 0 ? (
                <img src={item.product.images[0].url} alt={item.product.name} />
              ) : (
                <div className={styles.noImagePlaceholder}>Немає фото</div>
              )}
              <button className={styles.similarProductFavorite}>
                <ReactSVG src={heart} />
              </button>
            </div>
            <div className={styles.similarProductInfo}>
              <h3 className={styles.similarProductName}>{item.product.name}</h3>
              <div className={styles.similarProductPrice}>
                {item.product.newPrice ? (
                  <>
                    <span className={styles.similarNewPrice}>
                      {item.product.newPrice} грн
                    </span>
                    <span className={styles.similarOldPrice}>
                      {item.product.price} грн
                    </span>
                  </>
                ) : (
                  <span className={styles.similarPrice}>
                    {item.product.price} грн
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
