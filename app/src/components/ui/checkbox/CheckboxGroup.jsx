import { useEffect, useState } from "react";
import Checkbox from "./Checkbox";
import styles from "./CheckboxGroup.module.css";

/**
 * 
 * @param { values } an array of values that represent a single checkbox
 * @param { onChange } a callback that react when a checkbox state change
 */
function CheckboxGroup({
    label, 
    values, 
    onChange = () => { }
}) 
{
    const [, setChecked] = useState({});

    useEffect(() => {
        const initialState = values.reduce((acc, val) => ({ ...acc, [val]: false }), {});
        setChecked(initialState);
    }, [values])

    const onCheckboxChangeHandler = (val) => {
        setChecked(prevChecked => {
            const curr = prevChecked[val];
            const updatedState = { ...prevChecked, [val]: !curr };

            onChange(updatedState);

            return updatedState;
        });
    }

    const checkboxes = values.map(val => {
        return <Checkbox key={val} name={val} value={val} onChange={onCheckboxChangeHandler}/>
    });

    return (
        <div className={styles['checkbox-group']}>
            <label htmlFor={label}>{label}</label>
            <div className={styles['checkbox-container']}>
                {checkboxes}
            </div>
        </div>
    )
}

export default CheckboxGroup;