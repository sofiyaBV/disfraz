import foto1 from "../img/menu/Rectangle1.png";
import foto2 from "../img/menu/Rectangle2.png";
import foto3 from "../img/menu/Rectangle3.png";
import foto4 from "../img/menu/Rectangle4.png";
import foto5 from "../img/menu/Rectangle5.png";
import foto6 from "../img/menu/Rectangle6.png";
import foto7 from "../img/menu/Rectangle7.png";
import foto8 from "../img/menu/Rectangle8.png";
import foto9 from "../img/menu/Rectangle9.png";
import foto10 from "../img/menu/Rectangle10.png";
import foto11 from "../img/menu/Rectangle10.png";
import foto12 from "../img/menu/Rectangle12.png";

export const MENU_ITEMS = [
  { text: "Косплейні костюми" },
  { text: "Святкові костюми " },
  { text: "Аксесуари " },
  { text: "Взуття " },
  { text: "Головні убори " },
  { text: "Декорації та реквізит " },
];

export const PROMOTIONS = [
  {
    text: "Костюм Гэндальфа (The Lord Of Rings)",
    discount: "50%",
    link: "/anime1",
  },
  { text: "Костюм Артура Моргана (RDR 2)", discount: "25%", link: "/anime1" },
  { text: "Неоновый грим в 8-ми цветах", discount: "15%", link: "/anime1" },
];

export const CATALOG_CONTENT = [
  // Косплейні костюми
  {
    lists: [
      {
        title: "Всесвіт",
        items: [
          { text: "Аніме та манга", link: "/costumes/theme/anime_and_manga" },
          {
            text: "Геймерські персонажі",
            link: "/costumes/theme/gamer_charactrds",
          },
          { text: "Фільми та серіали", link: "/costumes/theme/film_and_TV" },
          {
            text: "Sci-Fi та кіберпанк",
            link: "/costumes/theme/Sci-Fi_and_cyberpank",
          },
          {
            text: "Фентезі та середньовіччя",
            link: "/costumes/theme/fantasy_and_middle_school",
          },
          {
            text: "Комікси Marvel/DC",
            link: "/costumes/theme/Marvel_DC_Comics",
          },
        ],
      },
      {
        title: "Типи костюмів",
        items: [
          { text: "Повні сет-костюми", link: "/costumes/type/all_set" },
          {
            text: "Маскаради та бальні образи",
            link: "/costumes/type/masquerade_and_ballrom",
          },
          {
            text: "Сукні та мантії",
            link: "/costumes/type/cloth_and_mantles",
          },
          { text: "Бойові костюми", link: "/costumes/type/fight_costumes" },
          { text: "Костюми супергероїв", link: "/costumes/type/superhero" },
          { text: "Казкові персонажі", link: "/costumes/type/fairytale" },
          { text: "Тематичні образи", link: "/costumes/type/thematic_looks" },
        ],
      },
      {
        title: "Призначення",
        items: [
          {
            text: "Костюми для фотосесій",
            link: "/costumes/purpose/for_photo",
          },
          {
            text: "Театральні та сценічні костюми",
            link: "/costumes/purpose/theatrical",
          },
          {
            text: "Карнавальні та фанатські костюми",
            link: "/costumes/purpose/carnaval",
          },
          {
            text: "Спортивні та бойові костюми",
            link: "/costumes/purpose/sports",
          },
        ],
      },
    ],
    images: [foto1, foto2],
  },
  // Святкові костюми (1 list)
  {
    lists: [
      {
        items: [
          { text: "хелловін", link: "/holiday/helloween" },
          { text: "різдво та новий рік", link: "/holiday/christmas" },
          { text: "день святого патрика", link: "/holiday/st_patrick's_day" },
          { text: "пасха", link: "/holiday/easter" },
          { text: "дитячі свята ", link: "/holiday/children's_holidays" },
          {
            text: "весілля та тематичні вечірки ",
            link: "/holiday/weddings_and_theme_parties",
          },
        ],
      },
    ],
    images: [foto3, foto4],
  },
  // Аксесуари (1 list)
  {
    lists: [
      {
        items: [
          { text: "Маски та грим", link: "/accessories/masks_and_makeup" },
          { text: "Лінзи", link: "/accessories/lenses" },
          { text: "Перуки", link: "/accessories/wigs" },
          {
            text: "Рукавички, кігті, кібер-руки",
            link: "/accessories/gloves_claws_cyber_hands",
          },
          {
            text: "Вуха, роги, хвости",
            link: "/accessories/ears_horns_tails",
          },
          { text: "Крила та накидки", link: "/accessories/wings_and_capes" },
          {
            text: "Обладнання (посохи, зброя)",
            link: "/accessories/equipment_staffs_weapons",
          },
          {
            text: "костюмна біжутерія та прикраси",
            link: "/accessories/costume_jewelry_and_ornaments",
          },
        ],
      },
    ],
    images: [foto5, foto6],
  },
  // Взуття (1 list)
  {
    lists: [
      {
        items: [
          { text: "черевики та чоботи", link: "/shoes/boots_and_shoes" },
          {
            text: "сандалії та легке взуття",
            link: "/shoes/sandals_and_light_shoes",
          },
          {
            text: "мокасини та святкові туфлі",
            link: "/shoes/moccasins_and_festive_shoes",
          },
          {
            text: "геймерські футуристичні моделі",
            link: "/shoes/gamer_futuristic_models",
          },
          { text: "тематичне взуття", link: "/shoes/thematic_shoes" },
        ],
      },
    ],
    images: [foto7, foto8],
  },
  // Головні убори (1 list)
  {
    lists: [
      {
        items: [
          { text: "Корони та діадеми", link: "/headwear/crowns_and_tiaras" },
          { text: "Капелюхи", link: "/headwear/hats" },
          { text: "бойові шоломи", link: "/headwear/combat_helmets" },
          {
            text: "Тематичні головні убори",
            link: "/headwear/thematic_headwear",
          },
        ],
      },
    ],
    images: [foto9, foto10],
  },
  // Декорації та реквізит (3 lists)
  {
    lists: [
      {
        items: [
          { text: "атрибути для фотосесій", link: "/props1" },
          { text: "декор для косплей зустрічей", link: "/props2" },
          { text: "карнавальні аксесуари", link: "/props3" },
          { text: "реалістична зброя", link: "/props3" },
        ],
      },
    ],
    images: [foto11, foto12],
  },
];
