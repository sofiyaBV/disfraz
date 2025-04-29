import React, { useState } from "react";
import style from "../../style/catalogMenu.module.css";
import arrow_right from "../../assets/arrow-right.png";
import arrow_selected from "../../assets/Vector.png";

const CatalogMenu = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuItems = [
    { text: "Косплейні костюми" },
    { text: "Святкові костюми " },
    { text: "Аксесуари " },
    { text: "Взуття " },
    { text: "Головні убори " },
    { text: "Декорації та реквізит " },
  ];

  const promotions = [
    {
      text: "Костюм Гэндальфа (The Lord Of Rings)",
      discount: "50%",
      link: "/anime1",
    },
    { text: "Костюм Артура Моргана (RDR 2)", discount: "25%", link: "/anime1" },
    { text: "Неоновый грим в 8-ми цветах", discount: "15%", link: "/anime1" },
  ];

  const contentInfo = [
    // Косплейні костюми (3 lists)
    {
      lists: [
        {
          title: "Аниме и манга",
          items: [
            { text: "Герои японских персонажей", link: "/anime1" },
            { text: "Фильмы та серийники", link: "/anime2" },
            { text: "Sci-Fi кие сериалы", link: "/anime3" },
          ],
        },
        {
          title: "Поп и сет-костюмы",
          items: [
            { text: "Маскарад та гало образ", link: "/pop1" },
            { text: "Сукня та костюми", link: "/pop2" },
            { text: "Больше костюмов", link: "/pop3" },
          ],
        },
        {
          title: "Герои комиксов",
          items: [
            { text: "Комиксы Marvel/DC", link: "/comics1" },
            { text: "Каждый персонаж", link: "/comics2" },
            { text: "Тематики образа", link: "/comics3" },
          ],
        },
      ],
      images: ["/path/to/cowboy.jpg", "/path/to/spiderman.jpg"],
    },
    // Святкові костюми (1 list)
    {
      lists: [
        {
          title: "Принадлежности к праздникам",
          items: [
            { text: "Карнавальные костюмы", link: "/holiday1" },
            { text: "Карнавальные костюмы для семьи", link: "/holiday2" },
          ],
        },
      ],
      images: ["/path/to/holiday1.jpg", "/path/to/holiday2.jpg"],
    },
    // Аксесуари (1 list)
    {
      lists: [
        {
          title: "Театральные и сценические костюмы",
          items: [
            { text: "Спортивные и боевые костюмы", link: "/accessory1" },
            { text: "Карнавальные костюмы для семьи", link: "/accessory2" },
          ],
        },
      ],
      images: ["/path/to/accessory1.jpg", "/path/to/accessory2.jpg"],
    },
    // Взуття (1 list)
    {
      lists: [
        {
          title: "Костюмы субкультур",
          items: [
            { text: "Костюмы субкультур", link: "/shoes1" },
            { text: "Карнавальные костюмы для семьи", link: "/shoes2" },
          ],
        },
      ],
      images: ["/path/to/shoes1.jpg", "/path/to/shoes2.jpg"],
    },
    // Головні убори (1 list)
    {
      lists: [
        {
          title: "Карнавальные та готические костюмы",
          items: [
            { text: "Карнавальные костюмы для вечеринок", link: "/hats1" },
            { text: "Карнавальные костюмы для семьи", link: "/hats2" },
          ],
        },
      ],
      images: ["/path/to/hats1.jpg", "/path/to/hats2.jpg"],
    },
    // Декорації та реквізит (3 lists)
    {
      lists: [
        {
          title: "Аниме и манга",
          items: [
            { text: "Герои японских персонажей", link: "/props1" },
            { text: "Фильмы та серийники", link: "/props2" },
            { text: "Sci-Fi кие сериалы", link: "/props3" },
          ],
        },
        {
          title: "Поп и сет-костюмы",
          items: [
            { text: "Маскарад та гало образ", link: "/props4" },
            { text: "Сукня та костюми", link: "/props5" },
            { text: "Больше костюмов", link: "/props6" },
          ],
        },
        {
          title: "Герои комиксов",
          items: [
            { text: "Комиксы Marvel/DC", link: "/props7" },
            { text: "Каждый персонаж", link: "/props8" },
            { text: "Тематики образа", link: "/props9" },
          ],
        },
      ],
      images: ["/path/to/props1.jpg", "/path/to/props2.jpg"],
    },
  ];

  return (
    <div className={style.container}>
      <div className={style.container_menu}>
        {menuItems.map((item, index) => (
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
        <div className={style.lists_container}>
          {contentInfo[selectedIndex]?.lists.map((list, idx) => (
            <div key={idx} className={style.list_section}>
              <h5>{list.title}</h5>
              <ul>
                {list.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <a href={item.link}>{item.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={style.promotions}>
          <h5>Акции</h5>
          <ul>
            {promotions.map((promo, idx) => (
              <li key={idx}>
                {promo.text} <span>{promo.discount}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={style.images}>
          {contentInfo[selectedIndex]?.images.map((src, idx) => (
            <img key={idx} src={src} alt={`Image ${idx + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogMenu;
