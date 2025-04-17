import GooglePay from "../assets/footer/app_download_11.png";
import AppStore from "../assets/footer/app_download_04.png";

export const footerSections = [
  {
    title: "Інформація про компанію",
    links: {
      "Про нас": "/about",
      "Мови вибору сайту": "/languages",
      Замовлення: "/orders",
      Контакти: "/contact",
    },
    type: "text",
  },
  {
    title: "Сервіс",
    links: {
      "Бонуси для друзів": "/bonuses",
      "Топ-акції сервісу": "/promotions",
      "Disfraz обмін": "/exchange",
      "Допомога клієнтам": "/support",
    },
    type: "text",
  },
  {
    title: "Допомога",
    links: {
      "Доставка та оплата": "/delivery",
      Кредит: "/credit",
      Гарантія: "/warranty",
      "Повернення товару": "/returns",
    },
    type: "text",
  },
  {
    title: "Партнерам",
    links: {
      "Програма на Disfraz": "/program",
      "Суперціна за нами": "/super-price",
      Офіційний: "/official",
      "Оренда реклами людям": "/ad-rental",
    },
    type: "text",
  },
  {
    title: "Завантажити наші додатки",
    apps: [
      { name: "Google Play", url: "/google-play", image: GooglePay },
      { name: "App Store", url: "/app-store", image: AppStore },
    ],
    socialTitle: "Ми у соціальних мережах",
    socialLinks: {
      Facebook: "/facebook",
      Instagram: "/instagram",
      Twitter: "/twitter",
      YouTube: "/youtube",
      LinkedIn: "/linkedin",
      TikTok: "/tiktok",
      WhatsApp: "/whatsapp",
    },
    type: "icon",
  },
];
