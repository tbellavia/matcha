import { createContext, useContext, useState } from "react";
import Theme from "../palette/theme";
import { changeBackground } from "../utils/theme";

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

    const onThemeSet = (theme) => {
        setTheme(theme);
        Theme.saveThemeInLocalStorage(theme);
    }

    const onTokenSet = (token) => {
        setToken(token);
        localStorage.setItem("token", token);
    }

    changeBackground(Theme.getStoredThemeOrDefault());
    return (
        <AppContext.Provider value={{
            ...ctx,
            theme,
            setTheme: onThemeSet,
            token,
            setToken: onTokenSet,
        }}>
            {props.children}
        </AppContext.Provider >
    );
};

export default AppContext;