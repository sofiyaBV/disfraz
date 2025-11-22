import { useEffect, useState } from "react";
import dataProvider from "../services/dataProvider";
import TematicsData from "../constants/TematicsData";

const useHomePageData = () => {
  const [thematicProductAttributes, setThematicProductAttributes] = useState(
    {}
  );
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Завантажуємо всі товари
        const allResponse = await dataProvider.getList("product-attributes", {
          filter: {},
        });
        const products = allResponse.data || [];
        setAllProducts(products);

        // Групуємо по тематиках
        const themes = TematicsData.map((item) => item.theme);
        const productsByTheme = {};

        for (const theme of themes) {
          const themeResponse = await dataProvider.getList(
            "product-attributes",
            {
              filter: { "attribute.theme": theme },
            }
          );
          productsByTheme[theme] = themeResponse.data || [];
        }

        setThematicProductAttributes(productsByTheme);
      } catch (err) {
        console.error("Помилка завантаження даних:", err);
        setError(err.message || "Помилка при завантаженні даних");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { thematicProductAttributes, allProducts, loading, error };
};

export default useHomePageData;
