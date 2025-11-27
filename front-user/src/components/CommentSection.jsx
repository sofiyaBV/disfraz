import { useEffect, useState } from "react";
import styles from "../style/pages/products/comments.module.css";
import dataProvider from "../utils/services/dataProvider";

const CommentSection = ({ productAttributeId, refresh }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await dataProvider.getList("comments", {
          filter: { productAttributeId },
        });
        setComments(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Помилка при завантаженні коментарів");
        setLoading(false);
      }
    };

    fetchComments();
  }, [productAttributeId, refresh]);

  if (loading)
    return <div className={styles.loading}>Завантаження коментарів...</div>;
  if (error) return <div className={styles.error}>Помилка: {error}</div>;

  return (
    <div className={styles.commentSection}>
      {comments.length === 0 ? (
        <p className={styles.noComments}>Коментарі відсутні</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <p className={styles.commentEmail}>
              {comment.user ? comment.user.email : "Anonymous"}
            </p>
            <p className={styles.commentContent}>{comment.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentSection;
