// components/homePage/CategoriesScrole.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Для навигации
import style from "../style/categoriesScrole.module.css"; // Импортируем CSS-модуль

const CategoriesScrole = ({ img, link }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link); // Переходим по ссылке при клике
  };

  return (
    <div className={style.container} onClick={handleClick}>
      <img src={img} alt="category" />
    </div>
  );
};

export default CategoriesScrole;
