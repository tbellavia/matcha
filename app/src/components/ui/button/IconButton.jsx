import Icon from "../icons/Icon";
import styles from "./IconButton.module.css";

function IconButton({ 
    label, 
    variant,
    iconColor, 
    onClick = () => {}, 
    className, 
    ...props 
}) 
{
    const classes = `${styles['button']} ${className}`;
    return (
        <button className={classes}>
            <Icon variant="error" className={styles['button__icon']} iconColor={iconColor}/>
            <span>{label}</span>
        </button>
    );
}

export default IconButton;