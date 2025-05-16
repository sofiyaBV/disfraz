import React from "react";
import ButtonGeneral from "../buttons/ButtonGeneral";
import style from "../../style/tematicsScrole.module.css";

const TematicsScrole = ({ text, bacgraundImg, buttonLink }) => {
  const imageUrl =
    typeof bacgraundImg === "object" && bacgraundImg.default
      ? bacgraundImg.default
      : bacgraundImg;
  const upperCaseText = text.toUpperCase();
  return (
    <div
      className={style.container}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className={style.content}>
        <h1>{upperCaseText}</h1>
        <ButtonGeneral
          initialColor="transparent"
          borderColor="white"
          text="Дивитись"
          width="clamp(1rem, 11vw, 49rem)"
          height="clamp(2rem, 5vw, 4.13rem)"
          link={buttonLink}
          textColor="white"
        />
      </div>
    </div>
  );
};

export default TematicsScrole;
