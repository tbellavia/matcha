import { createContext, useContext, useState } from "react";
import Theme from "../palette/theme";
import { changeBackground } from "../utils/theme";
import { useNavigate } from "react-router-dom";

const AppContext = createContext({
    // Theme
    theme: "",
    setTheme: (theme) => {},
    // User infos
    userID: null,
    setUserID: (userID) => {},
    isLoggedIn: false,
    setIsLoggedIn: (isLoggedIn) => {}
});

export const AppContextProvider = (props) => {
    const ctx = useContext(AppContext);
    const [theme, setTheme] = useState(Theme.getStoredThemeOrDefault());
    const [userID, setUserID] = useState(localStorage.getItem("userID"));
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") || false);
    const navigate = useNavigate();

    const onThemeSet = (theme) => {
        setTheme(theme);
        Theme.saveThemeInLocalStorage(theme);
    }

    const onUserIdChange = (userID) => {
        setUserID(userID);
        localStorage.setItem("userID", userID);
    }

    const onIsLoggedInChange = (loggedIn) => {
        setIsLoggedIn(loggedIn);
        localStorage.setItem("loggedIn", loggedIn);
    }

    const logout = () => {
        setIsLoggedIn(false);
        setUserID(null);

        localStorage.removeItem("userID");
        localStorage.removeItem("loggedIn");
        navigate("/login");
    }

    changeBackground(Theme.getStoredThemeOrDefault());
    return (
        <AppContext.Provider value={{
            ...ctx,
            // Theme
            theme,
            setTheme: onThemeSet,

            // User infos
            userID,
            isLoggedIn,
            setUserID: onUserIdChange,
            setIsLoggedIn: onIsLoggedInChange,

            // Auth
            logout
        }}>
            {props.children}
        </AppContext.Provider >
    );
};

export default AppContext;