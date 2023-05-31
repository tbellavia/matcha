import { createContext, useContext, useState } from "react";
import Theme from "../palette/theme";
import { changeBackground } from "../utils/theme";
import { useNavigate } from "react-router-dom";

const AppContext = createContext({
    // Theme
    theme: "",
    setTheme: (theme) => {},
    // Auth
    token: "",
    setToken: (token) => {},
});

export const AppContextProvider = (props) => {
    const ctx = useContext(AppContext);
    const [theme, setTheme] = useState(Theme.getStoredThemeOrDefault());
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [notifs, setNotifs] = useState({ views: {}, messages: {}, likes: {} });
    const navigate = useNavigate();

    // Theme
    const onThemeSet = (theme) => {
        setTheme(theme);
        Theme.saveThemeInLocalStorage(theme);
    }
    changeBackground(Theme.getStoredThemeOrDefault());

    // Auth
    const onTokenSet = (token) => {
        setToken(token);
        localStorage.setItem("token", token);
    }

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <AppContext.Provider value={{
            ...ctx,
            // Theme
            theme,
            setTheme: onThemeSet,
            // Token
            token,
            setToken: onTokenSet,
            logout,
            // Notifs
            notifs,
            setNotifs,
        }}>
            {props.children}
        </AppContext.Provider >
    );
};

export default AppContext;