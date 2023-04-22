import { useState } from "react";
import Checkbox from "./Checkbox";
import styles from "./CheckboxGroup.module.css";
import useUpdateEffect from "../../../hooks/use-update-effect";
import Label from "../label/Label";

/**
 * 
 * @param { values } an array of values that represent a single checkbox
 * @param { onChange } a callback that react when a checkbox state change
 */
function CheckboxGroup({
    label, 
    values, 
    onChange = () => { },
    onBlur = () => { },
}) 
{
    const [checked, setChecked] = useState(values.reduce((acc, val) => ({ ...acc, [val]: false }), {}));

    useUpdateEffect(() => {
        onChange(checked)
    }, [checked]);

    const onCheckboxChangeHandler = (val) => {
        setChecked(prevChecked => ({ ...prevChecked, [val]: !prevChecked[val] }));
    }

    const checkboxes = values.map(val => {
        return <Checkbox key={val} name={val} value={val} onChange={onCheckboxChangeHandler}/>
    });

    const onBlurHandler = () => {
        onBlur(checked);
    }


    return (
        <div className={styles['checkbox-group']}>
            <Label htmlFor={label} label={label}/>
            <div className={styles['checkbox-container']} onBlur={onBlurHandler}>
                {checkboxes}
            </div>
        </div>
    )
}

export default CheckboxGroup;