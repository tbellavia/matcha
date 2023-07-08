import React from "react";
import Button from "../../../../components/ui/button/Button";
import styles from "../../Profile.module.scss";

function ButtonGroupMatch() {
    return (
        <React.Fragment>
            <Button
                type="submit"
                variant="regular"
                className={styles["button"]}>
                supprimer
            </Button>
            <Button
                type="submit"
                variant="action-danger"
                className={styles["button"]}>
                bloquer
            </Button>
        </React.Fragment>
    )
}

export default ButtonGroupMatch;