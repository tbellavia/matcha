import './App.css';
import Home from "./pages/home/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import CreateProfile from "./pages/profile/create/CreateProfile";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/profile/create" element={<CreateProfile/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
