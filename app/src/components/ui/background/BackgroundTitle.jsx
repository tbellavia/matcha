import { useContext } from "react";
import AppContext from "../../../store/AppContext";
import styles from "./BackgroundTitle.module.css";

function BackgroundTitle({ variant, className, children }) {
    const ctx = useContext(AppContext);
    const col = styles[`title__${ctx.theme}__${variant}`];
    const classes = `${className} ${styles.title} ${col}`;

    return (
        <h2 className={classes}>{children.toUpperCase()}</h2>
    );
}

export default BackgroundTitle;