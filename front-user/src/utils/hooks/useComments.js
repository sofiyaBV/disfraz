import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import dataProvider from "../services/dataProvider";

const useComments = (productAttributeId) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const submitComment = async (content, { onSuccess, onError }) => {
    if (!isAuthenticated) {
      onError?.("Будь ласка, увійдіть в акаунт для надсилання коментаря!");
      return false;
    }

    if (!content?.trim()) {
      onError?.("Коментар не може бути порожнім");
      return false;
    }

    setLoading(true);

    try {
      await dataProvider.create("comments", {
        data: { productAttributeId, content },
      });
      onSuccess?.("Коментар надіслано!");
      return true;
    } catch (err) {
      console.error("Помилка при надсиланні коментаря:", err);
      onError?.(
        "Помилка при надсиланні коментаря: " +
          (err.message || "Невідома помилка")
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitComment, loading };
};

export default useComments;
