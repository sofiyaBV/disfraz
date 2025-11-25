// components/buttons/ButtonGeneral.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../style/components/buttons/buttonGeneral.module.css";

const ButtonGeneral = ({
  initialColor = "black",
  borderColor = "black",
  textColor = "white",
  text,
  width,
  height,
  transitionDuration = "0.3s",
  link = "#",
  type = "button",
  disabled = false,
  colorHover,
  onClick,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const backgroundColor = isHovered
    ? colorHover || (initialColor === "white" ? "#000" : "#fff")
    : initialColor;

  const finalTextColor = isHovered
    ? colorHover
      ? textColor
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

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }

    if (link) {
      navigate(link);
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
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
