import React from 'react';
import Button from "../../../../components/ui/button/Button";
import styles from "../../Profile.module.scss";

function ButtonGroupMe() {
    return (
        <React.Fragment>
            <Button
                type="submit"
                variant="regular"
                className={styles["button"]}>
                modifier
            </Button>
            <Button
                type="submit"
                variant="action-danger"
                className={styles["button"]}>
                supprimer
            </Button>
        </React.Fragment>
    )
}

export default ButtonGroupMe;