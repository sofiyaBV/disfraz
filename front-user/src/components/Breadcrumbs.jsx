import React from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "../style/breadcrumbs.module.css";

const nameMap = {
  "": "DISFRAZ",
  registration: "РЕЄСТРАЦІЯ",
  my_account: "МІЙ АККАУНТ",
  tematics: "РОЗДІЛ",
  error: "ПОМИЛКА",
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const paths = [""].concat(pathnames);

  if (location.pathname === "/error" || location.pathname === "/") {
    return null;
  }

  return (
    <div className={styles.breadcrumbs}>
      {paths.map((value, index) => {
        const isLast = index === paths.length - 1;
        const to =
          index === 0 ? "/" : `/${paths.slice(1, index + 1).join("/")}`;
        const displayName = nameMap[value] || value.toUpperCase();

        return (
          <span key={to} className={styles.breadcrumb_item}>
            {isLast ? (
              <>
                <span className={styles.breadcrumb_text}>{displayName}</span>
                <span className={styles.breadcrumb_separator}> / </span>
              </>
            ) : (
              <>
                <Link to={to} className={styles.breadcrumb_link}>
                  {displayName}
                </Link>
                <span className={styles.breadcrumb_separator}> / </span>
              </>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
