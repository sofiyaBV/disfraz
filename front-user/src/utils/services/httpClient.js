// HTTP клієнт для роботи з API
const httpClient = async (url, options = {}) => {
  // Встановлюємо базові заголовки
  if (!options.headers) {
    options.headers = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
  }

  // Додаємо токен авторизації з localStorage
  const token = localStorage.getItem("token");
  const skipAuth = options.skipAuth || false;

  if (token && !skipAuth) {
    options.headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, options);

    // Обробляємо помилки запиту
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || "Request failed";
      } catch (e) {
        errorMessage = errorText || "Request failed";
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export default httpClient;
