import { useEffect, useState } from "react";
import dataProvider from "./dataProvider";

const useProduct = ({ theme, attributeId } = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const filter = {};
        if (theme) filter.theme = theme;
        if (attributeId) filter.attributeId = attributeId;

        const response = await dataProvider.getList("products", {
          page: 1,
          perPage: 6,
          sortField: "id",
          sortOrder: "ASC",
          filter,
        });
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Ошибка при загрузке товаров");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [theme, attributeId]);

  return { products, loading, error };
};

export default useProduct;
