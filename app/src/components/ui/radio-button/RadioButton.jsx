import { useContext } from "react";
import styles from "./RadioButton.module.css";
import AppContext from "../../../store/AppContext";

function RadioButton({ name, value, checked = false }) {
    const { theme } = useContext(AppContext);
    const themeStyle = styles[`radio__${theme}`];

    return (
        <div className={`${styles.radio} ${themeStyle}`}>
            <input id={value} type="radio" name={name} value={value} checked={checked}/>
            <label htmlFor={value}>{ value }</label>
        </div>
    );
}

export default RadioButton;