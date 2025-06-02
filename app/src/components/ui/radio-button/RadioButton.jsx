import { useContext } from "react";
import styles from "./RadioButton.module.css";
import AppContext from "../../../store/AppContext";

function RadioButton({ name, value, checked = false, onChange = () => {} }) {
    const { theme } = useContext(AppContext);
    const themeStyle = styles[`radio__${theme}`];

    const onChangeHandler = (event) => {
        onChange(event.target.value);
    }

    return (
        <div className={`${styles.radio} ${themeStyle}`}>
            <input id={value} type="radio" name={name} value={value} checked={checked} onChange={onChangeHandler}/>
            <label htmlFor={value}>{ value }</label>
        </div>
    );
}

export default RadioButton;