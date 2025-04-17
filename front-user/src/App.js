import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Registration from "./pages/Registration";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
// import Navigation from "./components/Navigation";
import general from "./style/general_style.css";

function App() {
  return (
    <div className={general}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
