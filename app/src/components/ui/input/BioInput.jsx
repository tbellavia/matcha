import { useContext } from "react";
import useUniqueId from "../../../hooks/use-unique-id";
import Label from "../label/Label";
import styles from "./BioInput.module.css";
import _ from "lodash";
import AppContext from "../../../store/AppContext";

function BioInput({
    value,
    limit,
    onChange = () => { },
    onBlur = () => { }
}){
    if ( !_.isNumber(limit) )
        throw new Error("BioInput: error, limit is not a number");
    if ( limit <= 0 )
        throw new Error("BioInput: error, limit must be a positive number");
    const { theme } = useContext(AppContext);
    const [id] = useUniqueId("bio");

    const onChangeHandler = (e) => {
        const { value } = e.target;

        onChange(value.slice(0, limit));
    }

    const onBlurHandler = (e) => {
        onBlur(e.target.value);
    }

    return (
        <div className={styles.bio}>
            <div className={styles['bio__label-container']}>
                <Label label="Bio" htmlFor={id}/>
            </div>
            <div className={styles['bio__input-container']}>
                <textarea
                    id={id} 
                    onChange={onChangeHandler} 
                    onBlur={onBlurHandler}
                    value={value}
                ></textarea>
            </div>
            <div className={styles['bio__counter-container']}>
                <p className={styles[`bio__counter__${theme}`]}>{`${value.length}/${limit}`}</p>
            </div>
        </div>
    )
}

export default BioInput;