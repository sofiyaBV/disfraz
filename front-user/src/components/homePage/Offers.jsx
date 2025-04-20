import ButtonGeneral from "../buttons/ButtonGeneral";
import style from "../../style/offers.module.css";

const Offers = ({
  title = "Offers",
  description = "Check out our latest offers!",
  buttonText = "See Offers",
  buttonLink = "/offers",
  textColor = "white",
  backgroundColor = "black",
  buttonTextColor = "white",
  img,
}) => {
  return (
    <div className={style.offers_container}>
      <div className={style.offers_content}>
        <div
          className={style.text_section}
          style={{ backgroundColor, color: textColor }}
        >
          <h1>{title}</h1>
          <p>{description}</p>
          <ButtonGeneral
            initialColor="transparent"
            borderColor={textColor}
            text={buttonText}
            width="clamp(1rem, 11vw, 49rem)"
            height="clamp(2rem, 5vw, 4.13rem)"
            link={buttonLink}
            textColor={buttonTextColor}
          />
        </div>
        <div className={style.image_section}>
          <img src={img} alt="Offer Foto" />
        </div>
      </div>
    </div>
  );
};

export default Offers;
