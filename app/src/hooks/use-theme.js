import { useContext } from "react";
import AppContext from "../store/AppContext";

export function useTheme() {
    const { theme } = useContext(AppContext);

    return theme;
}