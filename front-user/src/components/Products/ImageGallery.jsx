import { useState } from "react";
import styles from "../../style/pages/products/imageGallery.module.css";

const ImageGallery = ({ images = [], productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentImage = images[selectedIndex] || images[0] || null;

  return (
    <div className={styles.imageSection}>
      <div className={styles.thumbnailColumn}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img.url}
            alt={`${productName} ${index + 1}`}
            className={`${styles.thumbnail} ${
              selectedIndex === index ? styles.thumbnailActive : ""
            }`}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>
      <div className={styles.mainImageContainer}>
        {currentImage ? (
          <img
            src={currentImage.url}
            alt={productName}
            className={styles.mainImage}
          />
        ) : (
          <div className={styles.imagePlaceholder}>Немає зображення</div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
