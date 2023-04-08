import { useContext } from "react";
import AppContext from "../../../store/AppContext";
import styles from "./MidLink.module.css";
import { Link } from "react-router-dom";

function MidLink({ lien, title, children }) {
    const ctx = useContext(AppContext);
    const boxCol = styles[`box__color__${ctx.theme}`];
    //const col = styles[`box__${ctx.theme}`];
    const classes = `box__center ${boxCol}`;

    return (
        <div className={classes}>
            <h2 className={styles.titleMidLink}>
                {children.toUpperCase()}
            </h2>
            <Link to={lien} className={styles['box__link']}>
                <h2 className={styles.titleMidLink}>
                    {title.toUpperCase()}
                </h2>
            </Link>
        </div>
    );
}

export default MidLink;