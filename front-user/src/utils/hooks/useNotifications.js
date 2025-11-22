import { useState, useCallback, useEffect } from "react";

const useNotifications = (autoHideDelay = 3000) => {
  const [notifications, setNotifications] = useState({
    success: null,
    error: null,
  });

  const showSuccess = useCallback((message) => {
    setNotifications({ success: message, error: null });
  }, []);

  const showError = useCallback((message) => {
    setNotifications({ success: null, error: message });
  }, []);

  const clear = useCallback(() => {
    setNotifications({ success: null, error: null });
  }, []);

  // Автоочищення
  useEffect(() => {
    if (notifications.success || notifications.error) {
      const timer = setTimeout(clear, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [notifications, autoHideDelay, clear]);

  return {
    success: notifications.success,
    error: notifications.error,
    showSuccess,
    showError,
    clear,
  };
};

export default useNotifications;
