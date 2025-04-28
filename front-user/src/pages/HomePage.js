// src/pages/HomePage.js
import React, { useEffect, useRef, useState } from "react";
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
import ThematicProducts from "../components/Products/ThematicProducts";
import { getProducts } from "../utils/dataProvider";

import img1man from "../img/newsS/man1.png";
import img2man from "../img/newsS/man2.png";
import img1woman from "../img/newsS/women1.png";
import img2woman from "../img/newsS/women2.png";

const HomePage = () => {
  const scrollRef = useRef(null);
  const tematicsScrollRef1 = useRef(null);
  const tematicsScrollRef2 = useRef(null);
  const categoriesScrollRef = useRef(null);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const currentTematicsIndexRef = useRef(0);

  // Состояние для хранения товаров по тематикам
  const [thematicProducts, setThematicProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояние для текущей выбранной тематики (индекс в TematicsData)
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

  // Список тематик для загрузки (берём из TematicsData)
  const themesToLoad = TematicsData.map((item) => item.theme);

  // Функция для загрузки товаров по тематике
  const fetchProductsByTheme = async (theme) => {
    try {
      // Маппинг тем на украинский для API (обновляем в соответствии с данными API)
      const themeMapping = {
        "sci-fi-cyberpunk": "Sci-fi та кіберпанк",
        "battle-costumes": "Бойові костюми",
        halloween: "Хелловін",
        "fantasy-medieval": "Фентезі та середньовіччя",
        "anime-manga": "Аніме та манга",
        "dresses-robes": "Сукні та мантії",
        "masquerade-ball": "Маскаради та бальні образи",
        "dc-universe": "Всесвіт DC",
        "fairy-tale-characters": "Казкові персонажі",
        "masks-makeup": "Маски та грим",
        "decor-props": "Декорації та реквізит",
      };
      const apiTheme = themeMapping[theme] || theme;
      const response = await getProducts({
        page: 1,
        perPage: 6,
        sortField: "id",
        sortOrder: "ASC",
        filter: { theme: apiTheme },
      });
      return response.data;
    } catch (err) {
      console.error(`Error fetching products for theme ${theme}:`, err);
      throw err;
    }
  };

  // Загружаем товары при монтировании страницы
  useEffect(() => {
    const loadAllProducts = async () => {
      setLoading(true);
      try {
        const productsByTheme = {};
        for (const theme of themesToLoad) {
          if (!thematicProducts[theme]) {
            const products = await fetchProductsByTheme(theme);
            productsByTheme[theme] = products;
          }
        }
        setThematicProducts((prev) => ({ ...prev, ...productsByTheme }));
        setLoading(false);
      } catch (err) {
        setError(err.message || "Ошибка при загрузке товаров");
        setLoading(false);
      }
    };

    loadAllProducts();
  }, []); // Пустой массив зависимостей — запросы выполняются только при монтировании

  // Функции для переключения тематик
  const handlePrevTheme = () => {
    setCurrentThemeIndex((prevIndex) =>
      prevIndex === 0 ? TematicsData.length - 1 : prevIndex - 1
    );
  };

  const handleNextTheme = () => {
    setCurrentThemeIndex((prevIndex) =>
      prevIndex === TematicsData.length - 1 ? 0 : prevIndex + 1
    );
  };

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

      if (deltaTime >= 5500) {
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

      if (deltaTime >= 6000) {
        setCurrentNewsIndex((prevIndex) =>
          prevIndex === newsData.length - 1 ? 0 : prevIndex + 1
        );
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
    const tematicsContainer = tematicsScrollRef1.current;
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

  useEffect(() => {
    let mounted = true;
    const tematicsContainer = tematicsScrollRef2.current;
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

      if (deltaTime >= 6000) {
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

  const currentNews = newsData[currentNewsIndex];
  const currentTheme = TematicsData[currentThemeIndex].theme;

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
      <div className={style.scrol_tematic} ref={tematicsScrollRef1}>
        {TematicsData.map((item, index) => (
          <TematicsScrole
            key={index}
            text={item.title}
            bacgraundImg={item.img}
            buttonLink={item.link}
          />
        ))}
      </div>
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
      {/* Секция с товарами и стрелками */}
      <div className={style.themeNavigation}>
        <button onClick={handlePrevTheme} className={style.navArrow}>
          {"<"}
        </button>
        <ThematicProducts
          theme={currentTheme}
          products={thematicProducts[currentTheme] || []}
          loading={loading}
          error={error}
        />
        <button onClick={handleNextTheme} className={style.navArrow}>
          {">"}
        </button>
      </div>
      <div className={style.scrol_tematic} ref={tematicsScrollRef2}>
        {TematicsData.map((item, index) => (
          <TematicsScrole
            key={index}
            text={item.title}
            bacgraundImg={item.img}
            buttonLink={item.link}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
