import { useEffect, useState } from "react";
import dataProvider from "../services/dataProvider";

const useProductAttributes = ({ productId } = {}) => {
  const [productAttributes, setProductAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductAttributes = async () => {
      if (!productId) {
        setProductAttributes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await dataProvider.getList("product-attributes", {
          filter: { productId },
        });
        setProductAttributes(response.data);
        setLoading(false);
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching product attributes:", err);
        }
        setError(
          err.message || "Помилка при завантаженні зв'язків продукт-атрибут"
        );
        setLoading(false);
      }
    };

    fetchProductAttributes();
  }, [productId]);

  return { productAttributes, loading, error };
};

export default useProductAttributes;
