import GooglePay from "../assets/footer/app_download_11.png";
import AppStore from "../assets/footer/app_download_04.png";

export const footerSections = [
  {
    title: "Інформація про компанію",
    links: {
      "Про нас": "/about_us",
      "Умови використання сайту": "/terms_of_use",
      Вакансії: "/vacancies",
      Контакти: "/contacts",
      "Всі категорії": "/all_categories",
    },
    type: "text",
  },
  {
    title: "Сервіси",
    links: {
      "Бонусний рахунок": "/bonus_account",
      "Подарункові сертифікати": "/gift_certificates",
      "Disfraz обмін": "/disfraz_exchange",
      "Корпоративним клієнтам": "/corporate_clients",
    },
    type: "text",
  },
  {
    title: "Допомога",
    links: {
      "Доставка та оплата": "/delivery_and_payment",
      Кредит: "/credit",
      Гарантія: "/warranty",
      "Повернення товару": "/returns",
    },
    type: "text",
  },
  {
    title: "Партнерам",
    links: {
      "Продавати на Disfraz": "/sell_on_disfraz",
      "Співпраця за нами": "/supercooperation-price",
      Франчайзинг: "/franchising",
      "Оренда рекламних площ": "/ad-advertising_space_rental",
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
