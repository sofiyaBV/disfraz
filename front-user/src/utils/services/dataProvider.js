import authService from "./authService";
import productService from "./productService";
import attributeService from "./attributeService";
import commentService from "./commentService";
import cartService from "./cartService";
import orderService from "./orderService";
import paymentService from "./paymentService";

const resourceHandlers = {
  getList: {
    products: (params) => productService.fetchProducts(params),
    "product-attributes": (params) =>
      attributeService.fetchProductAttributes(params),
    attributes: (params) => attributeService.fetchAttributes(params),
    comments: (params) => commentService.fetchComments(params),
  },

  getOne: {
    products: (params) => productService.fetchProductById(params.id),
    "user/profile": () => authService.fetchUserProfile(),
  },

  create: {
    users: (params) => authService.register(params.data),
    cart: (params) => cartService.addToCart(params.data),
    comments: (params) => commentService.createComment(params.data),
    orders: (params) => orderService.createOrder(params.data),
    "payment/create-checkout-session": (params) =>
      paymentService.createCheckoutSession(params.data),
  },

  update: {
    "user/profile": (params) => authService.updateUserProfile(params.data),
  },
};

// Уніфікований інтерфейс для роботи з API
const dataProvider = {
  getList: async (resource, params) => {
    const handler = resourceHandlers.getList[resource];
    if (!handler) {
      throw new Error(`Unsupported resource for getList: ${resource}`);
    }
    return handler(params);
  },

  getOne: async (resource, params) => {
    const handler = resourceHandlers.getOne[resource];
    if (!handler) {
      throw new Error(`Unsupported resource for getOne: ${resource}`);
    }
    return handler(params);
  },

  create: async (resource, params) => {
    const handler = resourceHandlers.create[resource];
    if (!handler) {
      throw new Error(`Unsupported resource for create: ${resource}`);
    }
    return handler(params);
  },

  update: async (resource, params) => {
    const handler = resourceHandlers.update[resource];
    if (!handler) {
      throw new Error(`Unsupported resource for update: ${resource}`);
    }
    return handler(params);
  },

  signin: async (params) => {
    return authService.signin(params);
  },
};

export default dataProvider;
