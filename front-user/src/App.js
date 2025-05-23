import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Registration from "./pages/Registration";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
// import Navigation from "./components/Navigation";
import general from "./style/general_style.css";
import Breadcrumbs from "./components/Breadcrumbs";
import ErrorPage from "./pages/ErrorPage";

import Tests from "./pages/Tests";
import { AuthProvider } from "./utils/AuthContext";
import AllSectionPage from "./pages/AllSectionPage";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <AuthProvider>
      <div className={general}>
        <Header />
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/my_account/registration" element={<Registration />} />
          <Route path="/:theme/:productName" element={<ProductPage />} />
          <Route path="/:theme/" element={<Tests />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="*" element={<Navigate to="/error" replace />} />
          <Route path="/tematics" element={<AllSectionPage />} />

          <Route path="/test" element={<Tests />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
