import React, { useState } from "react";
import { Link } from "react-router-dom";
import style from "../../style/catalogMenu.module.css";
import arrow_right from "../../assets/arrow-right.png";
import arrow_selected from "../../assets/Vector.png";
import {
  MENU_ITEMS,
  PROMOTIONS,
  CATALOG_CONTENT,
} from "../../constants/catalogData";

const CatalogMenu = ({ onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className={style.container}>
      <div className={style.container_menu}>
        {MENU_ITEMS.map((item, index) => (
          <div
            key={index}
            className={`${style.menu_item} ${
              selectedIndex === index ? style.selected : ""
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            <h4
              className={`${style.menu_text} ${
                selectedIndex === index ? style.selected_text : ""
              }`}
            >
              {item.text}
            </h4>
            <img
              src={selectedIndex === index ? arrow_selected : arrow_right}
              alt={item.text}
              className={style.menu_image}
            />
          </div>
        ))}
      </div>
      <div className={style.container_info}>
        <div className={style.container_info_text}>
          <div className={style.lists_container}>
            {CATALOG_CONTENT[selectedIndex]?.lists.map((list, idx) => (
              <div key={idx} className={style.list_section}>
                <h5>{list.title}</h5>
                <ul>
                  {list.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <Link to={item.link}>{item.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className={style.promotions}>
            <h5>Акції</h5>
            <ul>
              {PROMOTIONS.map((promo, idx) => (
                <li key={idx}>
                  <Link to={promo.link}>
                    {promo.text} <span>{promo.discount}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={style.images}>
          {CATALOG_CONTENT[selectedIndex]?.images.map((src, idx) => (
            <img key={idx} src={src} alt={`Image ${idx + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogMenu;
