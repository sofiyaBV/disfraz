import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Оновлюємо стан, щоб наступний рендер показав fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>Щось пішло не так</h1>
            <p style={styles.message}>
              Вибачте за незручності. Сталася неочікувана помилка.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>
                  Деталі помилки (dev mode)
                </summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div style={styles.actions}>
              <button style={styles.button} onClick={this.handleReset}>
                Спробувати ще раз
              </button>
              <button
                style={{ ...styles.button, ...styles.buttonSecondary }}
                onClick={() => (window.location.href = "/home")}
              >
                На головну
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Inline стилі для Error Boundary
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "40px",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "16px",
    textAlign: "center",
  },
  message: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "24px",
    textAlign: "center",
    lineHeight: "1.5",
  },
  details: {
    marginTop: "20px",
    marginBottom: "20px",
    padding: "12px",
    backgroundColor: "#f8f8f8",
    borderRadius: "4px",
    border: "1px solid #e0e0e0",
  },
  summary: {
    cursor: "pointer",
    fontWeight: "600",
    color: "#666",
    marginBottom: "8px",
  },
  errorText: {
    fontSize: "12px",
    color: "#d32f2f",
    overflow: "auto",
    maxHeight: "200px",
    padding: "8px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    border: "1px solid #ffcdd2",
  },
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginTop: "24px",
  },
  button: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "500",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#151515",
    color: "white",
    transition: "background-color 0.3s",
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    color: "#151515",
    border: "1px solid #151515",
  },
};

export default ErrorBoundary;
