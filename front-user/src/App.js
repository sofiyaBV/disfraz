import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Registration from "./pages/Registration";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />{" "}
      <Route path="/registration" element={<Registration />} />{" "}
    </Routes>
  );
}

export default App;
