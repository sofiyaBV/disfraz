import React from "react";
import styles from "../../style/buttons/buttonGeneral.module.css";

const ButtonGeneral = ({
  initialColor = "black",
  text,
  width,
  height,
  transitionDuration = "0.3s",
}) => {
  const buttonStyle = {
    width: width || "auto",
    height: height || "auto",
    transitionDuration: transitionDuration,
  };

  return (
    <button
      style={buttonStyle}
      className={`${styles.custom_button} ${
        initialColor === "black" ? styles.button_black : styles.button_white
      }`}
    >
      {text}
    </button>
  );
};

export default ButtonGeneral;
