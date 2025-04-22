const userDataProvider = {
  // Регистрация нового пользователя
  create: async (resource, params) => {
    if (resource !== "users") {
      throw new Error(`Unsupported resource: ${resource}`);
    }

    const { email, phone, password } = params.data;

    const response = await fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        phone,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const data = await response.json();
    return { data };
  },

  // Авторизация пользователя (не используется в форме, но добавим для полноты)
  signin: async (params) => {
    const { email, phone, password } = params;

    const response = await fetch("/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        phone,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signin failed");
    }

    const data = await response.json();
    return { data };
  },
};

export default userDataProvider;
