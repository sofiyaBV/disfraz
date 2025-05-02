import React from "react";
import style from "../../style/products/productScroll.module.css";
import ProductCard from "../cart/ProductCart";

const ProductScroll = ({
  title,
  products,
  handlePrev,
  handleNext,
  disabled,
}) => {
  return (
    <div className={style.scrollSection}>
      <div className={style.header}>
        <h3 className={style.h3}>
          {title}
          <span className={style.navigationArrows}>
            <button
              onClick={handlePrev}
              className={style.navArrow}
              disabled={disabled}
            >
              &lt;
            </button>
            <button
              onClick={handleNext}
              className={style.navArrow}
              disabled={disabled}
            >
              &gt;
            </button>
          </span>
        </h3>
      </div>
      <div className={style.productsScroll}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>Товарів не знайдено.</p>
        )}
      </div>
    </div>
  );
};

export default ProductScroll;
