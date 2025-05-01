// src/components/homePage/ThematicProducts.js
import React from "react";
import style from "../../style/products/thematicProducts.module.css";
import ProductCard from "../cart/ProductCart";
import TematicsData from "../../utils/TematicsData";

const ThematicProducts = ({ theme, products, loading, error }) => {
  const thematicData = TematicsData.find((item) => item.theme === theme) || {};
  const displayedProducts = products.slice(0, 6);

  return (
    <div className={style.thematicSection}>
      <div className={style.thematicContent}>
        {thematicData.img && (
          <div className={style.thematicImage}>
            <img src={thematicData.img} alt={thematicData.title} />
          </div>
        )}
        <div>
          <h3 className={style.h3}>{thematicData.title || theme}</h3>
          <div className={style.productsList}>
            {loading && <p>Завантаження...</p>}
            {error && <p>Помилка: {error}</p>}
            {!loading && !error && displayedProducts.length > 0
              ? displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
