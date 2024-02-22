import './App.css';
import Home from "./pages/home/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import CreateProfile from "./pages/profile/create/CreateProfile";
import {QueryClient, QueryClientProvider} from "react-query";
import Validation from "./pages/validation/Validation";
import Test from './pages/test/Test';
import RedirectHasCreatedProfile from "./components/redirects/RedirectHasCreatedProfile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
              path="/profile/create"
              element={
                <RedirectHasCreatedProfile fallback="/feed">
                  <CreateProfile />
                </RedirectHasCreatedProfile>
              }
          />
          <Route path="/validation" element={<Validation />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
