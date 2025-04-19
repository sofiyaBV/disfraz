import React, { useState } from "react";
import styles from "../../style/buttons/buttonGeneral.module.css"; // Импорт стилей для кнопки

const ButtonGeneral = ({ initialColor = "black", text }) => {
  // Состояние для отслеживания активности кнопки (чёрная или белая)
  const [isActive, setIsActive] = useState(false);

  // Функция для переключения состояния кнопки
  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <button
      className={`${styles.custom_button} ${
        initialColor === "black"
          ? isActive
            ? styles.button_white
            : styles.button_black
          : isActive
          ? styles.button_black
          : styles.button_white
      }`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default ButtonGeneral;
