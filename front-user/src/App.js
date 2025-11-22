import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Registration from "./pages/Registration";
import Authorization from "./components/registrations/Authorization";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import "./style/general_style.css";
import Breadcrumbs from "./components/Breadcrumbs";
import ErrorPage from "./pages/ErrorPage";
import ProfilePage from "./components/profile/profilePage";
import Tests from "./pages/Tests";
import { AuthProvider } from "./utils/context/AuthContext";
import AllSectionPage from "./pages/AllSectionPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
function App() {
  return (
    <AuthProvider>
      <div>
        <Header />
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<Authorization />} />
          <Route path="/authorization" element={<Authorization />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/:theme/:productName" element={<ProductPage />} />
          <Route path="/:theme/" element={<Tests />} />
          <Route path="/tematics" element={<AllSectionPage />} />
          <Route path="/test" element={<Tests />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
