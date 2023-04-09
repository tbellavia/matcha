import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import "./palette/light.css";
import "./palette/dark.css";
import "./palette/blind.css";
import "./palette/shades.css";
import "./App.css";
import Test from "./pages/test/Test";
import Error404 from "./pages/error404/Error404";
import MailValidation from "./pages/mailValidation/MailValidation";

const router = createBrowserRouter([
  { 
    path: "/",
    children: [
      { index: true, element: <Home/> },
      { path: "login", element: <Login/> },
      { path: "signup", element: <Signup/> },
      { path: "mailValidation", element: <MailValidation/>},
      { path: "feed", element: <Test/> },
      { 
        path: "profile",
        children: [
          { index: true, element: <Test/> },
          { path: ":id", element: <Test/> },
          { path: "create", element: <Test/> },
        ] 
      },
      { 
        path: "chat",
        children: [
          { index: true, element: <Test/> },
          { path: ":id", element: <Test/> },
        ]
      },
      { path: "test", element: <Test/> },
    ],
    errorElement: <Error404/>
  },
]);

function App() {
  return <RouterProvider router={router}/>;
}

export default App;
