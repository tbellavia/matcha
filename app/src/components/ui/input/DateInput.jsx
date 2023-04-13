import React, { useContext, useImperativeHandle, useRef } from "react";
import styles from "./Input.module.css";
import AppContext from "../../../store/AppContext";
import { useState } from "react";

function getMinAge(){
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = "0" + dd;
      }
  
    if (mm < 10) {
        mm = "0" + mm;
      }

    return (yyyy-18) + "-" + mm + "-" + dd
}

function DateInput ({label}){
    const ctx = useContext(AppContext);
    const labelColor = styles[`input__label__${ctx.theme}`];
    const inputColor = styles[`input__input__$(ctx.theme)`];
    const name = label.replace(/ /g, "_");
    const minAge = getMinAge()
    const [birth, setBirth] = useState(minAge);

    console.log(minAge)

    const onChangeHandler = (e) => {
        setBirth(e.target.value);
    }

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
                type="date"
                value= {birth}
                max={minAge}
                onChange={onChangeHandler}
            />
        </div>
    );
}

export default DateInput;