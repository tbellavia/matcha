import Button from "../button/Button";
import styles from "./Form.module.css";

function Form({ className, label, onSubmit, disabled = false, children }) {
    const formClasses = `${styles.form} ${className}`;

    return (
        <form className={formClasses} onSubmit={onSubmit}>
            {children}
            <Button 
                type="submit"
                variant="validation"
                className={styles['form__submit']}
                disabled={disabled}
            >
                {label}
            </Button>
        </form>
    );
}

export default Form;