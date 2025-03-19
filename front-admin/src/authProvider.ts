const apiUrl = import.meta.env.VITE_JSON_SERVER_URL;

export const authProvider = {
  async login({ email, password }) {
    const request = new Request(`${apiUrl}/auth/signin`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    const response = await fetch(request);
    if (response.status < 200 || response.status >= 300) {
      throw new Error("Login failed");
    }
    const { access_token } = await response.json();
    localStorage.setItem("token", access_token);
    localStorage.setItem("email", email);
  },
  async checkError(error) {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
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
