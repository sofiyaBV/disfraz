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
import ProductScroll from "../components/Products/ProductScroll";
import dataProvider from "../utils/dataProvider";

import img1man from "../img/newsS/man1.png";
import img2man from "../img/newsS/man2.png";
import img1woman from "../img/newsS/women1.png";
import img2woman from "../img/newsS/women2.png";

const HomePage = () => {
  const scrollRef = useRef(null);
  const tematicsScrollRef1 = useRef(null);
  const tematicsScrollRef2 = useRef(null);
  const categoriesScrollRef = useRef(null);
  const topSalesScrollRef = useRef(null);
  const discountScrollRef = useRef(null);

  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const currentTematicsIndexRef = useRef(0);

  const [thematicProductAttributes, setThematicProductAttributes] = useState(
    {}
  );
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [topSalesIndex, setTopSalesIndex] = useState(0);
  const [discountIndex, setDiscountIndex] = useState(0);

  const themesToLoad = TematicsData.map((item) => item.theme);
  const itemsPerPage = 4;

  const fetchProductAttributesByTheme = async (theme) => {
    try {
      const productAttributesResponse = await dataProvider.getList(
        "product-attributes",
        {
          filter: { "attribute.theme": theme },
        }
      );
      return productAttributesResponse.data || [];
    } catch (err) {
      console.error(
        `Error fetching product-attributes for theme ${theme}:`,
        err
      );
      throw err;
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await dataProvider.getList("product-attributes", {
        filter: {},
      });
      return response.data || [];
    } catch (err) {
      console.error("Error fetching all products:", err);
      throw err;
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const productAttributesByTheme = {};
        for (const theme of themesToLoad) {
          if (!thematicProductAttributes[theme]) {
            const productAttributes = await fetchProductAttributesByTheme(
              theme
            );
            productAttributesByTheme[theme] = productAttributes;
          }
        }
        setThematicProductAttributes((prev) => ({
          ...prev,
          ...productAttributesByTheme,
        }));

        const products = await fetchAllProducts();
        setAllProducts(products);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Ошибка при загрузке данных");
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

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

  const handlePrevTopSales = () => {
    setTopSalesIndex((prevIndex) =>
      prevIndex === 0
        ? Math.floor(topSalesProducts.length / itemsPerPage) - 1
        : prevIndex - 1
    );
  };

  const handleNextTopSales = () => {
    setTopSalesIndex((prevIndex) =>
      prevIndex === Math.floor(topSalesProducts.length / itemsPerPage) - 1
        ? 0
        : prevIndex + 1
    );
  };

  const handlePrevDiscount = () => {
    setDiscountIndex((prevIndex) =>
      prevIndex === 0
        ? Math.floor(discountProducts.length / itemsPerPage) - 1
        : prevIndex - 1
    );
  };

  const handleNextDiscount = () => {
    setDiscountIndex((prevIndex) =>
      prevIndex === Math.floor(discountProducts.length / itemsPerPage) - 1
        ? 0
        : prevIndex + 1
    );
  };

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

  const topSalesProducts = allProducts.filter(
    (product) => product.product?.topSale === true
  );

  const discountProducts = allProducts.filter(
    (product) => product.product?.newPrice != null
  );

  const displayedTopSales = topSalesProducts.slice(
    topSalesIndex * itemsPerPage,
    (topSalesIndex + 1) * itemsPerPage
  );
  const displayedDiscount = discountProducts.slice(
    discountIndex * itemsPerPage,
    (discountIndex + 1) * itemsPerPage
  );

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
      <div className={style.themeNavigation}>
        <ThematicProducts
          theme={currentTheme}
          productAttributes={thematicProductAttributes[currentTheme] || []}
          loading={loading}
          error={error}
          handlePrevTheme={handlePrevTheme}
          handleNextTheme={handleNextTheme}
        />
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
      <div className={style.topSales_discountSection}>
        <ProductScroll
          title="АКЦІЙНІ ТОВАРИ"
          products={displayedDiscount}
          handlePrev={handlePrevDiscount}
          handleNext={handleNextDiscount}
          disabled={discountProducts.length <= itemsPerPage}
        />
      </div>
      <div className={style.topSales_discountSection}>
        <ProductScroll
          title="ТОП ПРОДАЖ"
          products={displayedTopSales}
          handlePrev={handlePrevTopSales}
          handleNext={handleNextTopSales}
          disabled={topSalesProducts.length <= itemsPerPage}
        />
      </div>
    </div>
  );
};

export default HomePage;
