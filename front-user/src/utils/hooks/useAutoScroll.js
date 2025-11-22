import { useEffect, useRef } from "react";

const useAutoScroll = (
  containerRef,
  { interval = 5000, itemsPerScroll = 1, totalItems = 0 }
) => {
  const positionRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || totalItems === 0) return;

    let mounted = true;
    let lastTime = 0;

    const scroll = (currentTime) => {
      if (!mounted) return;

      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= interval) {
        const cardWidth = container.scrollWidth / totalItems;
        positionRef.current += cardWidth * itemsPerScroll;

        // Якщо дійшли до кінця — повертаємось на початок
        if (positionRef.current >= container.scrollWidth) {
          positionRef.current = 0;
        }

        container.scrollTo({
          left: positionRef.current,
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
  }, [containerRef, interval, itemsPerScroll, totalItems]);
};

export default useAutoScroll;
