import GooglePay from "../assets/footer/app_download_11.png";
import AppStore from "../assets/footer/app_download_04.png";

export const footerSections = [
  {
    title: "Інформація про компанію",
    links: {
      "Про нас": "/about",
      "Умови використання сайту": "/languages",
      Вакансії: "/orders",
      Контакти: "/contact",
    },
    type: "text",
  },
  {
    title: "Сервіси",
    links: {
      "Бонусний рахунок": "/bonuses",
      "Подарункові сертифікати": "/promotions",
      "Disfraz обмін": "/exchange",
      "Корпоративним клієнтам": "/support",
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
      "Продавати на Disfraz": "/program",
      "Співпраця за нами": "/super-price",
      Франчайзинг: "/official",
      "Оренда рекламних площ": "/ad-rental",
    },
    type: "text",
  },
  {
    title: "Завантажуйте наші застосунки",
    apps: [
      { name: "Google Play", url: "/google-play", image: GooglePay },
      { name: "App Store", url: "/app-store", image: AppStore },
    ],
    socialTitle: "Ми в соціальних мережах",
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
