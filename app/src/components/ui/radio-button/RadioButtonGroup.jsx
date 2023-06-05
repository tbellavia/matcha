import { useEffect } from "react";
import RadioButton from "./RadioButton"
import styles from "./RadioButtonGroup.module.css";
import useUniqueId from "../../../hooks/use-unique-id";
import Label from "../label/Label";

const DIRECTIONS = ["vertical", "horizontal"];

function RadioButtonGroup({
    label,
    initial,
    values,
    direction = "vertical",
    onChange = () => {},
    onBlur = () => {}
}) {
    if (!DIRECTIONS.includes(direction)) {
        throw new Error(`RadioButtonGroup: direction '${direction}' is not valid`);
    }
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

    const onBlurHandler = (event) => {
        onBlur(event.target.value);
    }

    return (
        <div className={styles['radio-group']}>
            <Label htmlFor={id} label={label}/>
            <div 
                id={id} 
                className={`${styles['radio-container']} ${styles[direction]}`} 
                onChange={onRadioGroupChangeHandler}
                onBlur={onBlurHandler}
            >
                {radios}
            </div>
        </div>
    )
}

export default RadioButtonGroup