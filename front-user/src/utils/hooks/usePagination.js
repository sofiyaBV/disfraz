import { useState, useCallback } from "react";

const usePagination = (totalItems, itemsPerPage = 4) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= totalPages - 1 ? 0 : prev + 1));
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? totalPages - 1 : prev - 1));
  }, [totalPages]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  // Індекси для slice
  const startIndex = currentIndex * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    currentIndex,
    totalPages,
    startIndex,
    endIndex,
    goNext,
    goPrev,
    reset,
    isDisabled: totalItems <= itemsPerPage,
  };
};

export default usePagination;
