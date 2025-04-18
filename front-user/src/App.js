import "./App.css";
import {Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Registration from "./pages/Registration";
import Footer from "./components/Footer";
// import Navigation from "./components/Navigation";
import general from "./style/general_style.css";

function App() {
    return (<div className={general}>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/registration" element={<Registration/>}/>
                <Route path="*" element={<div>404 - Page Not Found</div>}/>

            </Routes>
            <Footer/>
        </div>);
}

export default App;
