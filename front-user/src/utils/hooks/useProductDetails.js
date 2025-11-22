import { useEffect, useState } from "react";
import dataProvider from "../services/dataProvider";
import { transliterate } from "../helpers/transliterate";

const useProductDetails = (theme, productName) => {
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await dataProvider.getList("product-attributes", {
          filter: {},
        });
        const products = response.data || [];

        // Шукаємо товар по транслітерованому імені та темі
        const targetProduct = products.find((item) => {
          const slug = transliterate(item.product.name);
          const itemTheme = item.attribute.theme
            .toLowerCase()
            .replace(/\s+/g, "-");
          return slug === productName && itemTheme === theme;
        });

        if (!targetProduct) {
          throw new Error("Товар не знайдено");
        }

        setProduct(targetProduct);

        const similar = products
          .filter(
            (item) =>
              item.attribute.theme === targetProduct.attribute.theme &&
              item.id !== targetProduct.id
          )
          .slice(0, 4);

        setSimilarProducts(similar);
      } catch (err) {
        setError(err.message || "Помилка при завантаженні товару");
      } finally {
        setLoading(false);
      }
    };

    if (theme && productName) {
      fetchProduct();
    }
  }, [theme, productName]);

  return { product, similarProducts, loading, error };
};

export default useProductDetails;
