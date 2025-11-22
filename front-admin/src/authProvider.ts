const apiUrl = import.meta.env.VITE_JSON_SERVER_URL;

interface LoginParams {
  username?: string;
  phone?: string;
  password: string;
}

interface Identity {
  id: number;
  fullName: string;
}

export const authProvider = {
  async login({ username, phone, password }: LoginParams) {
    if (!username && !phone) {
      throw new Error("Потрібно вказати email або телефон");
    }

    const response = await fetch(`${apiUrl}/auth/signin`, {
      method: "POST",
      body: JSON.stringify({ email: username, phone, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Помилка авторизації");
    }

    const { access_token } = await response.json();
    localStorage.setItem("token", access_token);
    if (username) localStorage.setItem("email", username);
    if (phone) localStorage.setItem("phone", phone);
  },

  async checkError({ status }: { status: number }) {
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

  async getIdentity(): Promise<Identity> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Токен не знайдено");

    const response = await fetch(`${apiUrl}/auth/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Не вдалося отримати дані користувача");
    }

    const { id, fullName } = await response.json();
    return { id, fullName };
  },

  async getPermissions() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.roles;
    } catch {
      return null;
    }
  },
};
