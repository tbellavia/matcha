import { useEffect } from "react";
import RadioButton from "./RadioButton"
import styles from "./RadioButtonGroup.module.css";
import useUniqueId from "../../../hooks/use-unique-id";
import Label from "../label/Label";

function RadioButtonGroup({
    label,
    initial,
    values,
    onChange = () => {}
}) {
    const [id] = useUniqueId(label);

    useEffect(() => {
        if (values.length === 0)
            throw new Error("RadioButtonGroup: 'values' array has a length of 0 but expect at least one element.");
        if (initial && !values.includes(initial))
            throw new Error("RadioButtonGroup: 'values' does not contains 'initial' value");
    }, [values, initial])

    const radios = values.map((val, index) => {
        const checked = val === initial;
        
        return <RadioButton name={id} value={val} checked={checked} key={index}/>;
    });

    const onRadioGroupChangeHandler = (event) => {
        onChange(event.target.value);
    }

    return (
        <div className={styles['radio-group']}>
            <Label htmlFor={id} label={label}/>
            <div className={styles['radio-container']} id={id} onChange={onRadioGroupChangeHandler}>
                {radios}
            </div>
        </div>
    )
}

export default RadioButtonGroup