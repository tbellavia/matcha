import Label from "../label/Label";
import styles from "./Bio.module.css";

function Bio(props) {
    return (
        <div>
            <div className={styles.labelDiv}>
                Bio
            </div>
            <textarea id="bio" className={styles.bio} {...props}></textarea>
        </div>
    )
}

export default Bio;