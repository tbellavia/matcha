import { useContext } from "react";
import Card from "../card/Card";
import styles from "./Input.module.css";
import AppContext from "../../../store/AppContext";

function Input({ label, type, value, onChange }) {
    const ctx = useContext(AppContext);
    const onChangeHandler = (event) => {
        onChange(event.target.value);
    }
    const labelColor = styles[`input__label__${ctx.theme}`];
    const inputColor = styles[`input__input__$(ctx.theme)`];
    const name = label.replace(/ /g, "_");

    return (
        <div className={styles.input}>
            <label 
                htmlFor={name}
                className={`${styles['input__label']} ${labelColor}`}
            >
                {label.toUpperCase()}
            </label>
            <input 
                className={`${styles['input__input']} ${inputColor} round`}
                name={name} 
                type={type}
                value={value}
                onChange={onChangeHandler}
            />
        </div>
    );
}

export default Input;