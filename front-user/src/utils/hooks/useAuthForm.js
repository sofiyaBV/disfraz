import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const useAuthForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauth = urlParams.get("oauth");
    const oauthError = urlParams.get("error");

    if (oauthError) {
      setError("Помилка авторізації через Google. Спробуйте ще раз.");
      clearUrlParams();
    } else if (oauth === "success") {
      login();
      setSuccessMessage("Авторізація через Google успішна! Перенаправлення...");
      clearUrlParams();
      redirectToHome(800);
    }
  }, [login]);

  const clearUrlParams = () => {
    const newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  };

  const redirectToHome = (delay = 1500) => {
    timeoutRef.current = setTimeout(() => {
      navigate("/home");
    }, delay);
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    loading,
    setLoading,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    redirectToHome,
    clearMessages,
    navigate,
  };
};

export default useAuthForm;
