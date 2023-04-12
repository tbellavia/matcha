import { useContext } from "react";
import styles from "./Checkbox.module.css";
import AppContext from "../../../store/AppContext";

function Checkbox({ name, value, onChange, onBlur }) {
    const { theme } = useContext(AppContext);

    return (
        <div className={`${styles.checkbox} ${styles[theme]}`}>
            <input type="checkbox" id={name} name="check__femme" value="femme"/>
            <label htmlFor="check__femme">FEMME</label>
        </div>
    )
}

export default Checkbox;