import facebook from "../../img/icon/facebook_color.png";
import google from "../../img/icon/google_color.png";
import add from "../../assets/add.png";
import add_hover from "../../assets/add_hover.png";
import styles from "../../style/authorization.module.css";
import dataProvider from "../../utils/dataProvider";
import { useState } from "react";
import ButtonGeneral from "../buttons/ButtonGeneral";
import { useAuth } from "../../utils/AuthContext";

const Authorization = ({ onClose }) => {
  const { login } = useAuth();
  const [isPhoneLogin, setIsPhoneLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleLoginMethod = () => {
    setIsPhoneLogin(!isPhoneLogin);
    setFormData({ ...formData, email: "", phone: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { email, phone, password } = formData;
    if (!password) {
      setError("Пароль обязателен");
      setLoading(false);
      return;
    }
    if (isPhoneLogin && !phone) {
      setError("Введите номер телефона");
      setLoading(false);
      return;
    }
    if (!isPhoneLogin && !email) {
      setError("Введите email");
      setLoading(false);
      return;
    }

    try {
      const params = {
        email: isPhoneLogin ? "" : formData.email,
        phone: isPhoneLogin ? formData.phone : "",
        password: formData.password,
      };

      const response = await dataProvider.signin(params);
      console.log("Signin successful:", response.data);

      login(response.data.token || "some-token");

      onClose("Авторизація пройшла успішно!");
    } catch (err) {
      setError(err.message || "Не удалось авторизоваться. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.component}>
      <img
        className={styles.add}
        src={add}
        alt=""
        onMouseEnter={(e) => (e.currentTarget.src = add_hover)}
        onMouseLeave={(e) => (e.currentTarget.src = add)}
        onClick={() => onClose()}
      />
      <h2>Вхід</h2>
      <p>Увійти за допомогою профілю</p>
      <div className={styles.buttons}>
        <button>
          <img src={facebook} alt="Facebook" />
          <span>FACEBOOK</span>
        </button>
        <button>
          <img src={google} alt="Google" />
          <span>GOOGLE</span>
        </button>
      </div>
      <div className={styles.form}>
        <p>
          {isPhoneLogin
            ? "За номером телефону"
            : "Увійти за допомогою електронної пошти"}
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              <input
                type={isPhoneLogin ? "tel" : "email"}
                name={isPhoneLogin ? "phone" : "email"}
                placeholder={isPhoneLogin ? "38 (___) ___ - __ -__" : "Email"}
                value={isPhoneLogin ? formData.phone : formData.email}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p>
            <a href="#">Не пам'ятаю пароль</a>
          </p>
          <p>
            <a href="#" onClick={toggleLoginMethod}>
              {isPhoneLogin
                ? "Увійти за допомогою електронної пошти"
                : "Увійти за номером телефону"}
            </a>
          </p>
        </form>
        <p>
          <a href="/my_account/registration">Я ще не маю акаунта</a>
        </p>
      </div>
      <div className={styles.buttonsG}>
        <ButtonGeneral
          initialColor="black"
          borderColor="black"
          textColor="white"
          text={loading ? "Завантаження..." : "Продовжити"}
          width="100%"
          height="3.4rem"
          transitionDuration="0.3s"
          type="submit"
          colorHover="red"
          disabled={loading}
          onClick={handleSubmit}
          link=""
        />
        <p>Або</p>
        <ButtonGeneral
          initialColor="white"
          borderColor="black"
          textColor="black"
          text="ПРОДОВЖИТИ БЕЗ АВТОРИЗАЦІЇ"
          width="100%"
          height="3.4rem"
          transitionDuration="0.3s"
          type="button"
          onClick={() => onClose()}
          link=""
        />
      </div>
    </div>
  );
};

export default Authorization;
