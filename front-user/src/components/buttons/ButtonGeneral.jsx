import React from "react";
import styles from "../../style/buttons/buttonGeneral.module.css";
import { useNavigate } from "react-router-dom";
const ButtonGeneral = ({
  initialColor = "black",
  text,
  width,
  height,
  transitionDuration = "0.3s",
  link,
}) => {
  const navigate = useNavigate();
  const buttonStyle = {
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
      className={`${styles.custom_button} ${
        initialColor === "black" ? styles.button_black : styles.button_white
      }`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default ButtonGeneral;
