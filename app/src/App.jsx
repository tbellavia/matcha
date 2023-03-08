import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import "./palette/light.css";
import "./palette/dark.css";
import "./palette/blind.css";
import "./palette/shades.css";
import "./App.css";

const router = createBrowserRouter([
  { path: "/", element: <Home/> },
  { path: "/login", element: <Login/> },
  { path: "/signup", element: <Signup/> }
]);

function App() {
  return <RouterProvider router={router}/>;
}

export default App;
