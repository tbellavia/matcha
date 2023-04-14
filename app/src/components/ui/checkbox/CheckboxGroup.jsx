import { useEffect, useState } from "react";
import Checkbox from "./Checkbox";
import styles from "./CheckboxGroup.module.css";
import useUpdateEffect from "../../../hooks/use-update-effect";

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
    const [checked, setChecked] = useState(values.reduce((acc, val) => ({ ...acc, [val]: false }), {}));

    useUpdateEffect(() => {
        onChange(checked)
    }, [checked]);

    const onCheckboxChangeHandler = (val) => {
        setChecked(prevChecked => {
            const curr = prevChecked[val];
            const updatedState = { ...prevChecked, [val]: !curr };

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