import { useState } from "react";

export const useCatalogModal = () => {
  const [isCatalogMenuOpen, setIsCatalogMenuOpen] = useState(false);

  const openCatalogMenu = () => {
    setIsCatalogMenuOpen(true);
  };

  const closeCatalogMenu = () => {
    setIsCatalogMenuOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className.includes("modalOverlay")) {
      closeCatalogMenu();
    }
  };

  return {
    isCatalogMenuOpen,
    openCatalogMenu,
    closeCatalogMenu,
    handleOverlayClick,
  };
};
