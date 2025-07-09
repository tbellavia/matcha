import { useContext } from "react";
import styles from "./GenericPage.module.css"
import AppContext from "../../store/AppContext";

function GenericPage({ children, className, style }) {
    const ctx = useContext(AppContext)

    return (
        <div className={className} style={style}>
            {children}
        <div className={`${styles[`footer__${ctx.theme}`]} ${styles.footer}`}>Copyright © 2020 - 2025 Matcha, Inc. - All Rights Reserved.</div>
        </div>
    );
}

export default GenericPage;