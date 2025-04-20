import ButtonGeneral from "../buttons/ButtonGeneral";
import style from "../../style/newOnTheSite.module.css";

const NewsOnTheSite = ({
  title = "Новинки на сайті",
  productName,
  img,
  link,
}) => {
  return (
    // Новинки на сайті
    <div className={style.general}>
      <div>
        <h3>{title}</h3>
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
        <img src={img} alt={productName} />
      </div>
    </div>
  );
};

export default NewsOnTheSite;
