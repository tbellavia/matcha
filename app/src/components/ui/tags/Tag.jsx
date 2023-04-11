import styles from "./Tag.module.css";

function Tag({ 
    label, 
    onDelete = (value) => {},
}) 
{
    const onClickHandler = () => {
        onDelete(label);
    }

    return (
        <li className={styles.tag}>
            <span>#{ label }</span>
            <span onClick={onClickHandler}>&times;</span>
        </li>
    )
}

export default Tag;