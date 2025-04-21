import { motion } from "framer-motion";
import ButtonGeneral from "../buttons/ButtonGeneral";
import style from "../../style/newOnTheSite.module.css";
import { useState } from "react";

const SuitWM = ({ title = "Новинки на сайті", img1, img2, link, newsKey }) => {
  const [isHovered, setIsHovered] = useState(false); // Состояние наведения

  return (
    <div
      className={style.general}
      onMouseEnter={() => setIsHovered(true)} // При наведении
      onMouseLeave={() => setIsHovered(false)} // При уходе курсора
    >
      <div>
        <h3 className={style.h3_suit}>{title}</h3>
        <ButtonGeneral
          initialColor="white"
          borderColor="black"
          text="Більше товарів"
          link={link}
          textColor="black"
        />
      </div>
      <div>
        <motion.img
          key={newsKey + (isHovered ? "-hovered" : "")}
          src={isHovered ? img2 : img1}
          initial={{ opacity: 0, x: -20 }} // Сдвиг влево при появлении
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }} // Сдвиг вправо при уходе
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default SuitWM;
