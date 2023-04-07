import { useContext } from "react";
import AppContext from "../../../store/AppContext";
import styles from "./ErrorBackground.module.css";
import ErrorBackgroundTitles from "./ErrorBackgroundTitles";
import ErrorBackgroundTitle from "./ErrorBackgroundTitle";
import { useNavigate } from "react-router-dom";

function ErrorBackground({ paddingTop, title, title2, children }) {
    const ctx = useContext(AppContext);
    const titleCol = styles[`title__color__${ctx.theme}`];

    return (
        <div className={styles.background}>
            <div className={styles.overlay}>
                {children}
            </div>
            <div className={styles.inner}>
                <ErrorBackgroundTitles n={paddingTop}>erreur 404</ErrorBackgroundTitles>
                <ErrorBackgroundTitle variant="dark" className={titleCol}>{title}</ErrorBackgroundTitle>
                <ErrorBackgroundTitle variant="dark" className={titleCol}>{title2}</ErrorBackgroundTitle>
                <ErrorBackgroundTitles n={-30}>erreur 404</ErrorBackgroundTitles>
            </div>
        </div>
    );
}

export default ErrorBackground;