import { useContext } from "react";
import styles from "./Header.module.css";
import AppContext from "../../../store/AppContext";

function Header() {
    const { theme } = useContext(AppContext);
    const themeClass = styles[`header__${theme}`];

    return (
        <header className={`${styles.header} ${themeClass}`}>
            <div className={styles["header__bar"]}></div>
            <h1>MATCHA</h1>
            <div className={styles["header__bar"]}></div>
        </header>
    );
}

export default Header;