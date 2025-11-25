const httpClient = async (url, options = {}) => {
  // Встановлюємо базові заголовки
  if (!options.headers) {
    options.headers = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
  }

  options.credentials = "include";

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

    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");

    if (
      contentLength === "0" ||
      !contentType ||
      !contentType.includes("application/json")
    ) {
      return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Fetch error:", error);
    }
    throw error;
  }
};

export default httpClient;
