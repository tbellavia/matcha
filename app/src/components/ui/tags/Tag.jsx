import styles from "./Tag.module.css";

function Tag({ 
    label, 
    onDelete = (value) => {},
    isInput=false
}) 
{
    const onClickHandler = () => {
        onDelete(label);
    }

    return (
        <li className={styles.tag}>
            <span>#{ label }</span>
            {isInput?<span onClick={onClickHandler}>&times;</span>:null}
        </li>
    )
}

export default Tag;