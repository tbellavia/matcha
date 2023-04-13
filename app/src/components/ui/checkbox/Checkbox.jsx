import { useContext } from "react";
import styles from "./Checkbox.module.css";
import AppContext from "../../../store/AppContext";

function Checkbox({ 
    name,
    value,
    onChange = () => {},
}) 
{
    const { theme } = useContext(AppContext);
    const themeStyle = styles[`checkbox__${theme}`];

    const onChangeHandler = (event) => {
        onChange(event.target.value);
    }

    return (
        <div className={`${styles.checkbox} ${themeStyle}`}>
            <input
                type="checkbox"
                id={name}
                value={value}
                onChange={onChangeHandler}
            />
            <label htmlFor={name}>{name.toUpperCase()}</label>
        </div>
    )
}

export default Checkbox;