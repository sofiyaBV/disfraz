import React, { useEffect, useRef } from "react";
import style from "../style/pagesStyle/homePage.module.css";
import Offers from "../components/homePage/Offers";
import offersData from "../utils/OffersData";
import NewsOnTheSite from "../components/homePage/NewsOnTheSite";

import foto from "../img/newSite.png";

const HomePage = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth;
    const clientWidth = window.innerWidth;
    let scrollPosition = 0;

    const scrollInterval = setInterval(() => {
      scrollPosition += clientWidth;
      if (scrollPosition >= scrollWidth) {
        scrollPosition = 0;
      }
      scrollContainer.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }, 5000);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className={style.general}>
      <div className={style.offers_scroll} ref={scrollRef}>
        {offersData.map((offer, index) => (
          <Offers
            key={index}
            title={offer.title}
            description={offer.description}
            buttonText={offer.buttonText}
            buttonLink={offer.buttonLink}
            textColor={offer.textColor}
            backgroundColor={offer.backgroundColor}
            img={offer.img}
          />
        ))}
      </div>
      <div className={style.news_general}>
        <NewsOnTheSite
          title="Новинки на сайті"
          productName="Товар 1"
          img={foto}
          link="/products"
        />
      </div>
    </div>
  );
};

export default HomePage;
