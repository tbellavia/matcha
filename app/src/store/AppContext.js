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

const AppContextProvider = (props) => {
    const ctx = useContext(AppContext);
    const [theme, setTheme] = useState(Theme.LIGHT);
    const [token, setToken] = useState(null);

    return (
        <AppContext.Provider value={{
            ...ctx,
            theme,
            setTheme,
            token,
            setToken,
        }}>
            {props.children}
        </AppContext.Provider >
    );
};