import { useContext } from "react";
import style from "./ThemeSelector.module.css";
import AppContext from "../../../store/AppContext";

function ThemeSelector() {
    const ctx = useContext(AppContext);

    const onThemeChange = ({ target }) => {
        ctx.setTheme(target.value);
    }

    return (
        <select
            name="theme"
            className={style.theme}
            onChange={onThemeChange}
            value={ctx.theme}
        >
            <option value="light">light</option>
            <option value="dark">dark</option>
            <option value="blind">blind</option>
        </select>
    );
}

export default ThemeSelector;