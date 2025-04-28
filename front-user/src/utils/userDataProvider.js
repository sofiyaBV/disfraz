// utils/userDataProvider.js
const apiUrl = process.env.REACT_APP_JSON_SERVER_URL;

if (!apiUrl || typeof apiUrl !== "string" || apiUrl.trim() === "") {
  throw new Error(
    "REACT_APP_JSON_SERVER_URL is not defined or invalid in .env"
  );
}

const userDataProvider = {
  create: async (resource, params) => {
    if (resource !== "users") {
      throw new Error(`Unsupported resource: ${resource}`);
    }

    const { email, phone, password } = params.data;

    const response = await fetch(`${apiUrl}/auth/register`, {
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
      const errorText = await response.text();
      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || "Registration failed";
      } catch (e) {
        errorMessage = errorText || "Registration failed";
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { data };
  },

  signin: async (params) => {
    const { email, phone, password } = params;

    const response = await fetch(`${apiUrl}/auth/signin`, {
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
      const errorText = await response.text();
      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || "Signin failed";
      } catch (e) {
        errorMessage = errorText || "Signin failed";
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { data };
  },
};

export default userDataProvider;
