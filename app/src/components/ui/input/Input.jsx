import React, { useContext, useImperativeHandle, useRef } from "react";
import styles from "./Input.module.css";
import AppContext from "../../../store/AppContext";

const Input = React.forwardRef(({ 
    label,
    type,
    value,
    onChange = () => {},
    onBlur = () => {}
}, ref) => {
    const ctx = useContext(AppContext);
    const onChangeHandler = (event) => {
        onChange(event.target.value);
    }
    const onBlurHandler = (event) => {
        onBlur(event.target.value);
    }
    const inputRef = useRef();
    const labelColor = styles[`input__label__${ctx.theme}`];
    const inputColor = styles[`input__input__$(ctx.theme)`];
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
            <label 
                htmlFor={name}
                className={`${styles['input__label']} ${labelColor}`}
            >
                {label.toUpperCase()}
            </label>
            <input 
                className={`${styles['input__input']} ${inputColor} round`}
                name={name} 
                type={type}
                value={value}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                ref={inputRef}
            />
        </div>
    );
})

export default Input;