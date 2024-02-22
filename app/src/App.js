import './App.css';
import Home from "./pages/home/Home";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import CreateProfile from "./pages/profile/create/CreateProfile";
import {QueryClient, QueryClientProvider} from "react-query";
import Validation from "./pages/validation/Validation";
import Test from './pages/test/Test';
import EditProfile, {loadProfile} from "./pages/profile/edit/EditProfile";
import Blank from "./pages/blank/Base";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {retry: false}
    }
});

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Home/>
        },
        {
            path: "/login",
            element: <Login/>
        },
        {
            path: "/signup",
            element: <Signup/>
        },
        {
            path: "/profile/edit",
            loader: loadProfile,
            element: <EditProfile/>
        },
        {
            path: "/profile/create",
            element: <CreateProfile/>
        },
        {
            path: "/feed",
            element: <Blank name="feed"/>,
        },
        {
            path: "/validation",
            element: <Validation/>
        },
        {
            path: "/test",
            element: <Test/>
        },
    ]
);

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    );
}

export default App;
