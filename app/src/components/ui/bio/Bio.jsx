import AppContext from "../../../store/AppContext";
import styles from "./Bio.module.css";
import { useContext } from "react";

function Bio(props) {
    const { theme } = useContext(AppContext);
    const themeStyle = styles[`labelDiv__${theme}`];

    return (
        <div>
            <div className={`${themeStyle} ${styles.labelDiv}`}>
                Bio
            </div>
            <textarea id="bio" className={styles.bio} {...props}></textarea>
        </div>
    )
}

export default Bio;