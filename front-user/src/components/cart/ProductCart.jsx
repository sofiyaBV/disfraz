import React, { useState } from "react";
import style from "../../style/cart/productCart.module.css";
import { ReactSVG } from "react-svg";
import heart from "../../assets/svg/heartborder.svg";

import foto from "../../img/newsS/man1.png";
const name = "Назва товару";
const price = "1000";
const link = "/product";

const ProductCart = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <div className={style.container}>
      <div className={style.container_img}>
        <ReactSVG
          src={heart}
          className={`${style.icon} ${isClicked ? style.clicked : ""}`}
          onClick={handleClick}
          wrapper="span" // Оборачиваем в span для удобства стилизации
        />
        <img src={foto} alt={name} className={style.image} />
      </div>
      <div className={style.container_text}>
        <p className={style.name}>{name}</p>
        <h3 className={style.price}>
          {price}
          <span> грн</span>
        </h3>
      </div>
    </div>
  );
};

export default ProductCart;
