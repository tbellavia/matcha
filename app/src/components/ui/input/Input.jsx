import React, { useContext, useImperativeHandle, useRef } from "react";
import styles from "./Input.module.css";
import AppContext from "../../../store/AppContext";
import Label from "../label/Label";

const Input = React.forwardRef(({ 
    label,
    type,
    value,
    onChange = () => {},
    onBlur = () => {},
    placeholder
}, ref) => {
    const { theme } = useContext(AppContext);
    const onChangeHandler = (event) => {
        onChange(event.target.value);
    }
    const onBlurHandler = (event) => {
        onBlur(event.target.value);
    }
    const inputRef = useRef();
    const inputColor = styles[`input__input__${theme}`];
    const name = label.replace(/ /g, "_");
    
    useImperativeHandle(ref, () => {
        return { 
            focus: () => {
                inputRef.current.focus();
            } 
        }
    });
    
    return (
        <div className={styles.input}>
            <Label label={label} htmlFor={name} className={styles['input__label']}/>
            <input 
                className={`${styles['input__input']} ${inputColor} round`}
                name={name} 
                type={type}
                value={value}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                ref={inputRef}
                placeholder={placeholder}
            />
        </div>
    );
})

export default Input;