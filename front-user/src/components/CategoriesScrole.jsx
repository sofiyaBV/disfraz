import React from "react";
import { useNavigate } from "react-router-dom";
import style from "../style/categoriesScrole.module.css";

const CategoriesScrole = ({ img, link }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return (
    <div className={style.container} onClick={handleClick}>
      <img src={img} alt="category" />
    </div>
  );
};

export default CategoriesScrole;
