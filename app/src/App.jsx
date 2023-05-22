import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import TestPage from "./pages/test/TestPage";
import CreateProfile from "./pages/create-profile/CreateProfile";
import Profile from "./pages/profile/Profile";
import Chat from "./pages/chat/Chat";
import { AppContextProvider } from "./store/AppContext";
import Chat from "./pages/chat/Chat"
import AllChat from "./pages/allChat/AllChat";

function App() {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="mailValidation" element={<MailValidation />} />
          <Route path="feed" element={<TestPage title="/feed" />} />
          <Route path="profile">
            <Route index element={<Profile />} />
            <Route path=":id" element={<TestPage title="/profile/:id" />} />
            <Route path="create" element={<CreateProfile />} />
          </Route>
          <Route path="chat">
            <Route index element={ <AllChat title="/chat"/> }/>
            <Route path=":id" element={ <Chat title="/chat/:id"/>  } />
          </Route>
          <Route path="test" element={<Test />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </AppContextProvider>
    </BrowserRouter>
  )
}

export default App;
