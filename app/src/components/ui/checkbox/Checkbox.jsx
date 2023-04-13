import { useContext } from "react";
import styles from "./Checkbox.module.css";
import AppContext from "../../../store/AppContext";
import useUniqueId from "../../../hooks/use-unique-id";

function Checkbox({ 
    name,
    value,
    onChange = () => {},
}) 
{
    const [uniqueName] = useUniqueId(name);
    const { theme } = useContext(AppContext);
    const themeStyle = styles[`checkbox__${theme}`];

    const onChangeHandler = (event) => {
        onChange(event.target.value);
    }

    return (
        <div className={`${styles.checkbox} ${themeStyle}`}>
            <input
                type="checkbox"
                id={uniqueName}
                value={value}
                onChange={onChangeHandler}
            />
            <label htmlFor={uniqueName}>{name}</label>
        </div>
    )
}

export default Checkbox;