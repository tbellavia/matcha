import React, { useContext } from "react";
import styles from "./Input.module.css";
import AppContext from "../../../store/AppContext";
import { useState } from "react";
import Label from "../label/Label";

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
    const { theme } = useContext(AppContext);
    const inputColor = styles[`input__input__${theme}`];
    const name = label.replace(/ /g, "_");
    const minAge = getMinAge()
    const [birth, setBirth] = useState(minAge);

    const onChangeHandler = (e) => {
        setBirth(e.target.value);
    }

    return (
        <div className={styles.input}>
            <Label label={label} htmlFor={name} className={styles['input__label']}/>
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