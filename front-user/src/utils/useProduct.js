// src/utils/useProduct.js
import { useEffect, useState } from "react";
import { getProducts } from "./dataProvider";

const useProduct = ({ theme } = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const filter = theme ? { theme } : {};
        const response = await getProducts({
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
  }, [theme]); // Зависимость теперь от примитивного значения theme

  return { products, loading, error };
};

export default useProduct;
