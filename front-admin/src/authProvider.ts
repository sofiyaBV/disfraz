const apiUrl = import.meta.env.VITE_JSON_SERVER_URL;

// Провайдер авторизації для React Admin
export const authProvider = {
  async login({
    username,
    phone,
    password,
  }: {
    username?: string;
    phone?: string;
    password: string;
  }) {
    if (!username && !phone) {
      throw new Error("Потрібно вказати email або телефон");
    }

    const email = username;

    const request = new Request(`${apiUrl}/auth/signin`, {
      method: "POST",
      body: JSON.stringify({ email, phone, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const response = await fetch(request);
    if (response.status < 200 || response.status >= 300) {
      throw new Error("Помилка авторизації");
    }

    const { access_token } = await response.json();
    localStorage.setItem("token", access_token);
    if (email) localStorage.setItem("email", email);
    if (phone) localStorage.setItem("phone", phone);
  },

  async checkError(error: { status: any }) {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("phone");
      throw new Error("Сесія закінчилася");
    }
  },

  async checkAuth() {
    if (!localStorage.getItem("token")) {
      throw new Error("Користувач не авторизований");
    }
  },

  async logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");
  },

  async getIdentity() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Токен не знайдено");

    const request = new Request(`${apiUrl}/auth/profile`, {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${token}` }),
    });

    const response = await fetch(request);
    if (response.status < 200 || response.status >= 300) {
      throw new Error("Не вдалося отримати дані користувача");
    }

    const { id, fullName } = await response.json();
    return { id, fullName };
  },
};
