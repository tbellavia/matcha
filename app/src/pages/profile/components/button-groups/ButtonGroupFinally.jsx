import React from "react";
import Button from "../../../../components/ui/button/Button";
import styles from "../../Profile.module.scss";

function ButtonGroupFinally() {
    return <React.Fragment>
        <Button
            type="submit"
            variant="regular"
            className={styles["button"]}>
            nop
        </Button>
        <Button type="submit" variant="action-danger" className={styles["button"]}>okay</Button>
    </React.Fragment>;
}

export default ButtonGroupFinally;