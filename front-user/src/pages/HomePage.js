import { useRef } from "react";
import CategoriesScrole from "../components/CategoriesScrole";
import NewsOnTheSite from "../components/homePage/NewsOnTheSite";
import Offers from "../components/homePage/Offers";
import SuitWM from "../components/homePage/SuitWM";
import TematicsScrole from "../components/homePage/TematicsScrole";
import ProductScroll from "../components/Products/ProductScroll";
import ThematicProducts from "../components/Products/ThematicProducts";
import style from "../style/pages/home/homePage.module.css";

import categoriesData from "../utils/constants/CategoriesData";
import newsData from "../utils/constants/NewsData";
import offersData from "../utils/constants/OffersData";
import TematicsData from "../utils/constants/TematicsData";

import useAutoScroll from "../utils/hooks/useAutoScroll";
import useCarousel from "../utils/hooks/useCarousel";
import usePagination from "../utils/hooks/usePagination";
import useHomePageData from "../utils/hooks/useHomePageData";

import img1man from "../img/newsS/man1.png";
import img2man from "../img/newsS/man2.png";
import img1woman from "../img/newsS/women1.png";
import img2woman from "../img/newsS/women2.png";

const HomePage = () => {
  const offersScrollRef = useRef(null);
  const tematicsScrollRef1 = useRef(null);
  const tematicsScrollRef2 = useRef(null);
  const categoriesScrollRef = useRef(null);

  // Завантаження даних
  const { thematicProductAttributes, allProducts, loading, error } =
    useHomePageData();

  // Фільтруємо товари
  const topSalesProducts = allProducts.filter(
    (p) => p.product?.topSale === true
  );
  const discountProducts = allProducts.filter(
    (p) => p.product?.newPrice != null
  );

  // Автоскрол секцій
  useAutoScroll(offersScrollRef, {
    interval: 5500,
    itemsPerScroll: 1,
    totalItems: offersData.length,
  });

  useAutoScroll(tematicsScrollRef1, {
    interval: 5000,
    itemsPerScroll: 2,
    totalItems: TematicsData.length,
  });

  useAutoScroll(tematicsScrollRef2, {
    interval: 5000,
    itemsPerScroll: 2,
    totalItems: TematicsData.length,
  });

  useAutoScroll(categoriesScrollRef, {
    interval: 6000,
    itemsPerScroll: 5,
    totalItems: categoriesData.length,
  });

  // Карусель новин
  const currentNewsIndex = useCarousel(newsData.length, 6000);
  const currentNews = newsData[currentNewsIndex];

  // Пагінація тематик
  const themePagination = usePagination(TematicsData.length, 1);
  const currentTheme = TematicsData[themePagination.currentIndex]?.theme;

  // Пагінація топ продажів
  const topSalesPagination = usePagination(topSalesProducts.length, 4);
  const displayedTopSales = topSalesProducts.slice(
    topSalesPagination.startIndex,
    topSalesPagination.endIndex
  );

  // Пагінація акційних товарів
  const discountPagination = usePagination(discountProducts.length, 4);
  const displayedDiscount = discountProducts.slice(
    discountPagination.startIndex,
    discountPagination.endIndex
  );

  return (
    <div className={style.general}>
      {/* Офери */}
      <div className={style.offers_scroll} ref={offersScrollRef}>
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

      {/* Новини */}
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

      {/* Тематики 1 */}
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

      {/* Категорії */}
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

      {/* Тематичні товари */}
      <div className={style.themeNavigation}>
        <ThematicProducts
          theme={currentTheme}
          productAttributes={thematicProductAttributes[currentTheme] || []}
          loading={loading}
          error={error}
          handlePrevTheme={themePagination.goPrev}
          handleNextTheme={themePagination.goNext}
        />
      </div>

      {/* Тематики 2 */}
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

      {/* Акційні товари */}
      <div className={style.topSales_discountSection}>
        <ProductScroll
          title="АКЦІЙНІ ТОВАРИ"
          products={displayedDiscount}
          handlePrev={discountPagination.goPrev}
          handleNext={discountPagination.goNext}
          disabled={discountPagination.isDisabled}
        />
      </div>

      {/* Топ продаж */}
      <div className={style.topSales_discountSection}>
        <ProductScroll
          title="ТОП ПРОДАЖ"
          products={displayedTopSales}
          handlePrev={topSalesPagination.goPrev}
          handleNext={topSalesPagination.goNext}
          disabled={topSalesPagination.isDisabled}
        />
      </div>
    </div>
  );
};

export default HomePage;
