import React from "react";
import errorFoto from "../img/eror.png";
import ButtonGeneral from "../components/buttons/ButtonGeneral";
import style from "../style/pagesStyle/error.module.css";
const ErrorPage = () => {
  return (
    <div className={style.general_section}>
      <div>
        <img src={errorFoto} alt="Error 404" />
      </div>
      <div className={style.informations}>
        <h1>
          {" "}
          ЗДАЄТЬСЯ,
          <br /> ЩОСЬ ПІШЛО НЕ ТАК{" "}
        </h1>
        <p>
          Можливо, Ви потрапили сюди помилково.
          <br /> Краще повернутись на головну або скористатись пошуком по сайту.
        </p>
        <ButtonGeneral
          initialColor="black"
          text="НА ГОЛОВНУ"
          width="49rem"
          height="3.13rem"
          transitionDuration="0.1s"
          link="/"
        />
      </div>
    </div>
  );
};

export default ErrorPage;
