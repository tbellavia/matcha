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
import CreateProfile from "./pages/create-profile/CreateProfile";
import Profile from "./pages/profile/Profile";
import Chat from "./pages/chat/Chat";
import { AppContextProvider } from "./store/AppContext";
import AllChat from "./pages/allChat/AllChat";
import Feed from "./pages/feed/Feed";
import FeedLikes from "./pages/feedLikes/FeedLikes";
import FeedViews from "./pages/feedViews/FeedViews";
import FeedHistorics from "./pages/feedHistorics/FeedHistorics";
import GenericProfile from "./pages/profile/GenericProfile";
import UpdatePassword from "./pages/updatePassword/UpdatePassword";
// import UpdateProfile from "./pages/update-profile/UpdateProfile";

function App() {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="mailValidation" element={<MailValidation />} />
          <Route path="feed" element={<Feed/>} />
          <Route path="feedLikes" element={<FeedLikes/>} />
          <Route path="feedViews" element={<FeedViews/>} />
          <Route path="feedHistorics" element={<FeedHistorics/>} />
          <Route path="updatePassword/:id" element={<UpdatePassword/>} />
          <Route path="profile">
            <Route index element={<Profile />} />
            <Route path=":id" element={<GenericProfile />}/>
            <Route path="create" element={<CreateProfile />} />
            {/* <Route path="update" element={<UpdateProfile />} /> */}
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
