const apiUrl = import.meta.env.VITE_JSON_SERVER_URL;

export const authProvider = {
  async login({
    username,
    phone,
    password,
  }: {
    username?: string; // Из формы react-admin приходит username
    phone?: string;
    password: string;
  }) {
    // Проверяем, что хотя бы username (email) или phone переданы
    if (!username && !phone) {
      throw new Error("Email or phone must be provided");
    }

    // Преобразуем username в email
    const email = username;

    const request = new Request(`${apiUrl}/auth/signin`, {
      method: "POST",
      body: JSON.stringify({ email, phone, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const response = await fetch(request);
    if (response.status < 200 || response.status >= 300) {
      throw new Error("Login failed");
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
      throw new Error("Session expired");
    }
    // other error codes (404, 500, etc): no need to log out
  },

  async checkAuth() {
    if (!localStorage.getItem("token")) {
      throw new Error("Not authenticated");
    }
  },

  async logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");
  },

  async getIdentity() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const request = new Request(`${apiUrl}/auth/profile`, {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${token}` }),
    });

    const response = await fetch(request);
    if (response.status < 200 || response.status >= 300) {
      throw new Error("Failed to fetch user identity");
    }

    const { id, fullName } = await response.json();
    return { id, fullName };
  },
};
