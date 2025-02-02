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
    initial = {},
    onChange = () => { },
    onBlur = () => { },
}) 
{
    const initializeChecked = () => {
        return Object.keys(initial).length === 0
            ? values.reduce((acc, val) => ({ ...acc, [val]: false }), {})
            : initial;
    };
    // const [checked, setChecked] = useState(values.reduce((acc, val) => ({ ...acc, [val]: false }), {}));

    const [checked, setChecked] = useState(initializeChecked());
    const [init, setInit] = useState(initializeChecked())
 
    useUpdateEffect(() => {
        const newChecked = initializeChecked();
        if (JSON.stringify(newChecked) !== JSON.stringify(init)) {
            setChecked(newChecked)
            setInit(newChecked)
        }
        console.log("update")
    }, [initial]);

    useUpdateEffect(() => {
        onChange(checked)
    }, [checked]);

    const onCheckboxChangeHandler = (val) => {
        setChecked(prevChecked => ({ ...prevChecked, [val]: !prevChecked[val] }));
    }

    const checkboxes = values.map(val => {
        return <Checkbox key={val} name={val} value={val} checked={checked[val]} onChange={onCheckboxChangeHandler}/>
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