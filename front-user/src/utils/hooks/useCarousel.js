import { useState, useEffect } from "react";

const useCarousel = (totalItems, interval = 6000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (totalItems <= 1) return;

    let mounted = true;
    let lastTime = 0;

    const update = (currentTime) => {
      if (!mounted) return;

      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= interval) {
        setCurrentIndex((prev) => (prev >= totalItems - 1 ? 0 : prev + 1));
        lastTime = currentTime;
      }

      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);

    return () => {
      mounted = false;
    };
  }, [totalItems, interval]);

  return currentIndex;
};

export default useCarousel;
