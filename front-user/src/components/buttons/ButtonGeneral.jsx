// components/buttons/ButtonGeneral.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../style/buttons/buttonGeneral.module.css";

const ButtonGeneral = ({
  initialColor = "black",
  borderColor = "black",
  textColor = "white",
  text,
  width,
  height,
  transitionDuration = "0.3s",
  link,
  type = "button", // Добавляем type по умолчанию
  disabled = false, // Добавляем disabled
  colorHover, // Добавляем colorHover
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const backgroundColor = isHovered
    ? colorHover || (initialColor === "white" ? "#000" : "#fff")
    : initialColor;

  const finalTextColor = isHovered
    ? colorHover
      ? textColor // Если colorHover задан, текст остается прежнего цвета
      : initialColor === "white"
      ? "#fff"
      : "#000"
    : textColor;

  const buttonStyle = {
    backgroundColor: backgroundColor,
    borderColor: borderColor,
    color: finalTextColor,
    width: `clamp(1rem, 25vw, ${width || "49rem"})`,
    height: `clamp(2rem, 5vw, ${height || "3.13rem"})`,
    transition: `background-color ${transitionDuration}, color ${transitionDuration}`,
  };

  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <button
      type={type} // Передаем type
      disabled={disabled} // Передаем disabled
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
