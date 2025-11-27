import { useState } from "react";

const useReviewModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");

  const openModal = () => setShowModal(true);

  const closeModal = () => {
    setShowModal(false);
    setContent("");
  };

  const updateContent = (newContent) => setContent(newContent);

  return {
    showModal,
    content,
    openModal,
    closeModal,
    updateContent,
  };
};

export default useReviewModal;
