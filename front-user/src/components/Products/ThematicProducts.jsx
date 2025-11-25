import style from "../../style/pages/products/thematicProducts.module.css";
import TematicsData from "../../utils/constants/TematicsData";
import ProductCart from "../cart/ProductCart";

const ThematicProducts = ({
  theme,
  productAttributes,
  loading,
  error,
  handlePrevTheme,
  handleNextTheme,
}) => {
  const thematicData = TematicsData.find((item) => item.theme === theme) || {};
  const filteredProductAttributes = productAttributes.filter(
    (pa) => pa.attribute?.theme === theme
  );
  const displayedProductAttributes = filteredProductAttributes.slice(0, 6);

  return (
    <div className={style.thematicSection}>
      <div className={style.thematicContent}>
        {thematicData.img && (
          <div className={style.thematicImage}>
            <img src={thematicData.img} alt={thematicData.title} />
          </div>
        )}
        <div className={style.div_th}>
          <h3 className={style.h3}>
            {thematicData.title || theme}
            <span className={style.navigationArrows}>
              <button onClick={handlePrevTheme} className={style.navArrow}>
                &lt;
              </button>
              <button onClick={handleNextTheme} className={style.navArrow}>
                &gt;
              </button>
            </span>
          </h3>
          <div className={style.productsList}>
            {loading && <p>Завантаження...</p>}
            {error && <p>Помилка: {error}</p>}
            {!loading && !error && displayedProductAttributes.length > 0
              ? displayedProductAttributes.map((pa) => (
                  <ProductCart
                    key={pa.id}
                    product={pa.product}
                    theme={pa.attribute.theme}
                  />
                ))
              : !loading &&
                !error && <p>Товарів за цією тематикою не знайдено.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThematicProducts;
