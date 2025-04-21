// components/homePage/CartProduct.jsx
import React from "react";
import style from "../../style/cart/productCart.module.css";

const ProductCart = ({ name, price, url }) => {
  return (
    <div className={style.container}>
      <img src={url} alt={name} className={style.image} />
      <h3 className={style.name}>{name}</h3>
      <p className={style.price}>{price} грн</p>
    </div>
  );
};

export default ProductCart;
