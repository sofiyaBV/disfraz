import authService from "./authService";
import productService from "./productService";
import attributeService from "./attributeService";
import commentService from "./commentService";
import cartService from "./cartService";
import orderService from "./orderService";
import paymentService from "./paymentService";

const dataProvider = {
  // Отримання списків даних
  getList: async (resource, params) => {
    switch (resource) {
      case "products":
        return productService.fetchProducts(params);
      case "product-attributes":
        return attributeService.fetchProductAttributes(params);
      case "attributes":
        return attributeService.fetchAttributes(params);
      case "comments":
        return commentService.fetchComments(params);
      default:
        throw new Error(`Unsupported resource: ${resource}`);
    }
  },

  // Отримання одного запису
  getOne: async (resource, params) => {
    switch (resource) {
      case "products":
        return productService.fetchProductById(params.id);
      case "user/profile":
        return authService.fetchUserProfile();
      default:
        throw new Error(`Unsupported resource: ${resource}`);
    }
  },

  // Створення нових записів
  create: async (resource, params) => {
    switch (resource) {
      case "users":
        return authService.register(params.data);
      case "cart":
        return cartService.addToCart(params.data);
      case "comments":
        return commentService.createComment(params.data);
      case "orders":
        return orderService.createOrder(params.data);
      case "payment/create-checkout-session":
        return paymentService.createCheckoutSession(params.data);
      default:
        throw new Error(`Unsupported resource: ${resource}`);
    }
  },

  // Оновлення існуючих записів
  update: async (resource, params) => {
    switch (resource) {
      case "user/profile":
        return authService.updateUserProfile(params.data);
      default:
        throw new Error(`Unsupported resource: ${resource}`);
    }
  },

  // Метод для авторизації
  signin: async (params) => {
    return authService.signin(params);
  },
};

export default dataProvider;
