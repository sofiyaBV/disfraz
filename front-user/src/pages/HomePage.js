import React, { useEffect, useRef } from "react";
import style from "../style/pagesStyle/homePage.module.css";
import Offers from "../components/homePage/Offers";
import newsData from "../utils/NewsData";
import offersData from "../utils/OffersData";
import SuitWM from "../components/homePage/SuitWM";
import NewsOnTheSite from "../components/homePage/NewsOnTheSite";
import TematicsScrole from "../components/homePage/TematicsScrole";
import TematicsData from "../utils/TematicsData";
import CategoriesScrole from "../components/CategoriesScrole";
import categoriesData from "../utils/CategoriesData";
import ProductCard from "../components/cart/ProductCart";
import useProduct from "../utils/useProduct";

import img1man from "../img/newsS/man1.png";
import img2man from "../img/newsS/man2.png";
import img1woman from "../img/newsS/women1.png";
import img2woman from "../img/newsS/women2.png";

const HomePage = () => {
  const scrollRef = useRef(null);
  const tematicsScrollRef = useRef(null);
  const categoriesScrollRef = useRef(null);
  const currentNewsIndexRef = useRef(0);
  const currentTematicsIndexRef = useRef(0);

  const { products, loading, error } = useProduct();

  // Автопрокрутка для Offers
  useEffect(() => {
    let mounted = true;
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth;
    const clientWidth = window.innerWidth;
    let scrollPosition = 0;
    let lastTime = 0;

    const scroll = (currentTime) => {
      if (!mounted) return;

      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= 5000) {
        scrollPosition += clientWidth;
        if (scrollPosition >= scrollWidth) {
          scrollPosition = 0;
        }
        scrollContainer.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
        lastTime = currentTime;
      }

      requestAnimationFrame(scroll);
    };

    requestAnimationFrame(scroll);

    return () => {
      mounted = false;
    };
  }, []);

  // Циклическая смена новостей
  useEffect(() => {
    let mounted = true;

    const updateNews = (currentTime) => {
      if (!mounted) return;

      if (!lastNewsTime) lastNewsTime = currentTime;
      const deltaTime = currentTime - lastNewsTime;

      if (deltaTime >= 5000) {
        currentNewsIndexRef.current =
          currentNewsIndexRef.current === newsData.length - 1
            ? 0
            : currentNewsIndexRef.current + 1;
        lastNewsTime = currentTime;
      }

      requestAnimationFrame(updateNews);
    };

    let lastNewsTime = 0;
    requestAnimationFrame(updateNews);

    return () => {
      mounted = false;
    };
  }, []);

  // Автопрокрутка для TematicsScrole (по 2 карточки)
  useEffect(() => {
    let mounted = true;
    const tematicsContainer = tematicsScrollRef.current;
    if (!tematicsContainer) return;

    const cardWidth = tematicsContainer.scrollWidth / (TematicsData.length / 2);
    let scrollPosition = 0;
    let lastTime = 0;

    const scrollTematics = (currentTime) => {
      if (!mounted) return;

      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= 5000) {
        scrollPosition += cardWidth;
        if (scrollPosition >= tematicsContainer.scrollWidth) {
          scrollPosition = 0;
          currentTematicsIndexRef.current = 0;
        } else {
          currentTematicsIndexRef.current += 2;
        }
        tematicsContainer.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
        lastTime = currentTime;
      }

      requestAnimationFrame(scrollTematics);
    };

    requestAnimationFrame(scrollTematics);

    return () => {
      mounted = false;
    };
  }, []);

  // Автопрокрутка для CategoriesScrole (по 5 карточек)
  useEffect(() => {
    let mounted = true;
    const categoriesContainer = categoriesScrollRef.current;
    if (!categoriesContainer) return;

    const cardWidth =
      categoriesContainer.scrollWidth / (categoriesData.length / 5);
    let scrollPosition = 0;
    let lastTime = 0;

    const scrollCategories = (currentTime) => {
      if (!mounted) return;

      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= 5000) {
        scrollPosition += cardWidth;
        if (scrollPosition >= categoriesContainer.scrollWidth) {
          scrollPosition = 0;
        }
        categoriesContainer.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
        lastTime = currentTime;
      }

      requestAnimationFrame(scrollCategories);
    };

    requestAnimationFrame(scrollCategories);

    return () => {
      mounted = false;
    };
  }, []);

  const currentNews = newsData[currentNewsIndexRef.current];

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
            newsKey={currentNewsIndexRef.current}
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
      {/* Интерактив с карточками по тематикам */}
      <div className={style.products_section}>
        <h3>ТОВАРИ</h3>
        {loading && <p>Завантаження...</p>}
        {error && <p>Помилка: {error}</p>}
        {!loading && !error && (
          <div className={style.products_grid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                url={
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : img1man // Используем импортированное изображение как заглушку
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
