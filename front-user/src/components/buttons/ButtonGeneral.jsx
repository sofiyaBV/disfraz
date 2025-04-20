import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../style/buttons/buttonGeneral.module.css";

const ButtonGeneral = ({
  initialColor = "black",
  borderColor = "black",
  textColor = "white", // Переименовываем textColorname в textColor
  text,
  width,
  height,
  transitionDuration = "0.3s",
  link,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Логика для фона: зависит от initialColor
  const backgroundColor = isHovered
    ? initialColor === "white"
      ? "#000" // Если начальный цвет белый, при наведении фон черный
      : "#fff" // Иначе (черный, прозрачный, любой другой) — белый
    : initialColor;

  // Логика для текста: зависит от initialColor и textColor
  const finalTextColor = isHovered
    ? initialColor === "white"
      ? "#fff" // Если начальный цвет белый, текст белый
      : "#000" // Иначе текст черный
    : textColor; // В обычном состоянии используем переданный цвет текста

  const buttonStyle = {
    backgroundColor: backgroundColor,
    borderColor: borderColor,
    color: finalTextColor,
    width: `clamp(1rem, 25vw, ${width || "49rem"})`,
    height: `clamp(2rem, 5vw, ${height || "3.13rem"})`,
    transitionDuration: transitionDuration,
  };

  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <button
      style={buttonStyle}
      className={styles.custom_button}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
    </button>
  );
};

export default ButtonGeneral;
