import ButtonGeneral from "../buttons/ButtonGeneral";
import style from "../../style/newOnTheSite.module.css";
import { motion } from "framer-motion";

const NewsOnTheSite = ({
  title = "Новинки на сайті",
  productName,
  img,
  link,
  newsKey,
}) => {
  return (
    // Новинки на сайті
    <div className={style.general}>
      <div>
        <h3 className={style.h3_news}>{title}</h3>
        <p>{productName}</p>
        <ButtonGeneral
          initialColor="black"
          borderColor="black"
          text="Більше товарів"
          link={link}
          textColor="white"
        />
      </div>
      <div>
        <motion.img
          key={newsKey} // Ключ для перезапуска анимации при смене новости
          src={img}
          alt={productName}
          initial={{ opacity: 0 }} // Начальное состояние (затухание)
          animate={{ opacity: 1 }} // Конечное состояние (появление)
          exit={{ opacity: 0 }} // Состояние при уходе
          transition={{ duration: 0.5 }} // Длительность анимации
        />
      </div>
    </div>
  );
};

export default NewsOnTheSite;
