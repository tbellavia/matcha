import Label from "../label/Label";
import styles from "./Bio.module.css";

function Bio(props) {
    return (
        <div>
            <Label label="Bio"/>
            <textarea className={styles.bio} {...props}></textarea>
        </div>
    )
}

export default Bio;