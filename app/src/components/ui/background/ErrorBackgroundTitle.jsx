import { useContext } from "react";
import AppContext from "../../../store/AppContext";
import styles from "./ErrorBackgroundTitle.module.css";

function ErrorBackgroundTitle({ variant, className, children }) {
    const ctx = useContext(AppContext);
    const col = styles[`title__${ctx.theme}__${variant}`];
    const classes = `${className} ${styles.title} ${col}`;

    return (
        <h3 className={classes}>{children.toUpperCase()}</h3>
    );
}

export default ErrorBackgroundTitle;