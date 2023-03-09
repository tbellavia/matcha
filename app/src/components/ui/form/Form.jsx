import Button from "../button/Button";
import styles from "./Form.module.css";

function Form({ label, onSubmit, children }) {
    return (
        <form className={styles.form} onSubmit={onSubmit}>
            {children}
            <Button 
                type="submit"
                variant="validation"
                className={styles['form__submit']}
            >
                {label}
            </Button>
        </form>
    );
}

export default Form;