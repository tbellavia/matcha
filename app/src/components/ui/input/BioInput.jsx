import { useContext } from "react";
import useUniqueId from "../../../hooks/use-unique-id";
import styles from "./BioInput.module.css";
import _ from "lodash";
import AppContext from "../../../store/AppContext";
import Bio from "../bio/Bio";

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
            <Bio id={id} value={value} onChange={onChangeHandler} onBlur={onBlurHandler}/>
            <div className={styles['bio__counter-container']}>
                <p className={styles[`bio__counter__${theme}`]}>{`${value.length}/${limit}`}</p>
            </div>
        </div>
    )
}

export default BioInput;