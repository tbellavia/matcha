import React, { useContext } from "react";
import styles from "./Input.module.css";
import AppContext from "../../../store/AppContext";
import Label from "../label/Label";
import { getMinAge } from "../../../common/utils";

function DateInput ({
    label,
    value,
    onChange = () => {},
    onBlur = () => {}
}) {
    const { theme } = useContext(AppContext);
    const inputColor = styles[`input__input__${theme}`];
    const name = label.replace(/ /g, "_");
    const minAge = getMinAge()

    const onChangeHandler = (e) => {
        onChange(e.target.value);
    }

    const onBlurHandler = (e) => {
        onBlur(e.target.value);
    }

    return (
        <div className={styles.input}>
            <Label label={label} htmlFor={name} className={styles['input__label']}/>
            <input 
                className={`${styles['input__input']} ${inputColor} round`}
                name={name} 
                type="date"
                value={value}
                max={minAge}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
            />
        </div>
    );
}

export default DateInput;