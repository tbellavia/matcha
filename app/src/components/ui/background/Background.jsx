import { useContext } from "react";
import AppContext from "../../../store/AppContext";
import styles from "./Background.module.css";
import BackgroundTitles from "./BackgroundTitles";
import BackgroundTitle from "./BackgroundTitle";

function Background({ paddingTop, title, children }) {
    const ctx = useContext(AppContext);
    const titleCol = styles[`title__color__${ctx.theme}`];

    return (
        <div className={styles.background}>
            <div className={styles.overlay}>
                {children}
            </div>
            <div className={styles.inner}>
                <BackgroundTitles n={paddingTop}>matcha</BackgroundTitles>
                <BackgroundTitle variant="dark" className={titleCol}>{title}</BackgroundTitle>
                <BackgroundTitles n={20}>matcha</BackgroundTitles>
            </div>
        </div>
    );
}

export default Background;