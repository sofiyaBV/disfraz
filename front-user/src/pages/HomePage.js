import React, { useEffect, useRef, useState } from "react";
import style from "../style/pagesStyle/homePage.module.css";
import Offers from "../components/homePage/Offers";
import newsData from "../utils/NewsData";
import offersData from "../utils/OffersData";
import SuitWM from "../components/homePage/SuitWM";
import NewsOnTheSite from "../components/homePage/NewsOnTheSite";
import TematicsScrole from "../components/homePage/TematicsScrole";
import TematicsData from "../utils/TematicsData";
import CategoriesScrole from "../components/CategoriesScrole"; // Новый компонент
import categoriesData from "../utils/CategoriesData"; // Данные категорий

import img1man from "../img/newsS/man1.png";
import img2man from "../img/newsS/man2.png";
import img1woman from "../img/newsS/women1.png";
import img2woman from "../img/newsS/women2.png";

const HomePage = () => {
  const scrollRef = useRef(null);
  const tematicsScrollRef = useRef(null);
  const categoriesScrollRef = useRef(null); // Новый реф для категорий
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [currentTematicsIndex, setCurrentTematicsIndex] = useState(0);

  // Автопрокрутка для Offers
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

  // Циклическая смена новостей
  useEffect(() => {
    const newsInterval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) =>
        prevIndex === newsData.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(newsInterval);
  }, []);

  // Автопрокрутка для TematicsScrole (по 2 карточки)
  useEffect(() => {
    const tematicsContainer = tematicsScrollRef.current;
    if (!tematicsContainer) return;

    const cardWidth = tematicsContainer.scrollWidth / (TematicsData.length / 2);
    let scrollPosition = 0;

    const scrollInterval = setInterval(() => {
      scrollPosition += cardWidth;
      if (scrollPosition >= tematicsContainer.scrollWidth) {
        scrollPosition = 0;
      }
      tematicsContainer.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentTematicsIndex((prevIndex) =>
        prevIndex + 2 >= TematicsData.length ? 0 : prevIndex + 2
      );
    }, 5000);

    return () => clearInterval(scrollInterval);
  }, []);

  // Автопрокрутка для CategoriesScrole (по 5 карточек)
  useEffect(() => {
    const categoriesContainer = categoriesScrollRef.current;
    if (!categoriesContainer) return;

    const cardWidth =
      categoriesContainer.scrollWidth / (categoriesData.length / 5);
    let scrollPosition = 0;

    const scrollInterval = setInterval(() => {
      scrollPosition += cardWidth;
      if (scrollPosition >= categoriesContainer.scrollWidth) {
        scrollPosition = 0;
      }
      categoriesContainer.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }, 5000);

    return () => clearInterval(scrollInterval);
  }, []);

  const currentNews = newsData[currentNewsIndex];

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
      <div className={style.section_news}>
        <div className={style.news_general}>
          <NewsOnTheSite
            title="Новинки на сайті"
            productName={currentNews.productName}
            img={currentNews.img}
            link={currentNews.link}
            newsKey={currentNewsIndex}
          />
        </div>
        <div className={style.news_general}>
          <SuitWM title="Чоловічі костюми" img1={img1man} img2={img2man} />
        </div>
        <div className={style.news_general}>
          <SuitWM title="Жіночі костюми" img1={img1woman} img2={img2woman} />
        </div>
      </div>
      {/* Скролл TematicsScrole */}
      <div className={style.scrol_tematic} ref={tematicsScrollRef}>
        {TematicsData.map((item, index) => (
          <TematicsScrole
            key={index}
            text={item.title}
            bacgraundImg={item.img}
            buttonLink={item.link}
          />
        ))}
      </div>
      {/* Скролл Categories */}
      <div className={style.categories_section}>
        <h3>ПОПУЛЯРНІ КАТЕГОРІЇ</h3>
        <div className={style.scrol_categories} ref={categoriesScrollRef}>
          {categoriesData.map((category, index) => (
            <CategoriesScrole
              key={index}
              img={category.img}
              link={category.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
