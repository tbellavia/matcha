import { createContext, useContext, useState } from "react";
import Theme from "../palette/theme";

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
    const [theme, setTheme] = useState(Theme.LIGHT);
    const [token, setToken] = useState(null);

    const onThemeSet = (theme) => {
        setTheme(theme);
    }

    const onTokenSet = (token) => {
        setToken(token);
    }

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