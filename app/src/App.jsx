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
import AllChat from "./pages/allChat/AllChat";
import ProtectedRoute from "./components/ui/protected-route/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="mailValidation" element={
            <ProtectedRoute>
              <MailValidation />
            </ProtectedRoute>
          } />
          <Route path="feed" element={
            <ProtectedRoute>
              <TestPage title="/feed" />
            </ProtectedRoute>
          } />

          <Route path="profile">
            <Route index element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path=":id" element={
              <ProtectedRoute>
                <TestPage title="/profile/:id" />
              </ProtectedRoute>
            } />

            <Route path="create" element={
              <ProtectedRoute>
                <CreateProfile />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="chat">
            <Route index element={
              <ProtectedRoute>
                <AllChat title="/chat" />
              </ProtectedRoute>
            } />
            <Route path=":id" element={
              <ProtectedRoute>
                <Chat title="/chat/:id" />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="test" element={<Test />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </AppContextProvider>
    </BrowserRouter>
  )
}

export default App;
