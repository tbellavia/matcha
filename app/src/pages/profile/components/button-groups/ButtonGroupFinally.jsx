import React from "react";
import Button from "../../../../components/ui/button/Button";
import styles from "../../Profile.module.scss";
import useFetch from "../../../../hooks/use-fetch";
import {useNavigate} from "react-router-dom";

function ButtonGroupFinally({profileID}) {
    const fetcher = useFetch()
    const navigate = useNavigate()

    const onNopClicked = async () => {
        // TODO: Manage error
        try {
            await fetcher(`/api/user/unlike/me/${profileID}`, "POST");
            navigate("/feed");
        } catch (e) {
        }
    }

    const onOkayClicked = async () => {
        // TODO: Manage error
        try {
            await fetcher(`/api/user/like/me/${profileID}`, "POST");
            navigate("/feed")
        } catch (e) {
        }
    }

    return (
        <React.Fragment>
            <Button
                type="submit"
                variant="regular"
                className={styles["button"]}
                onClick={onNopClicked}
            >
                nop
            </Button>
            <Button
                type="submit"
                variant="action-danger"
                className={styles["button"]}
                onClick={onOkayClicked}
            >
                okay
            </Button>
        </React.Fragment>
    );
}

export default ButtonGroupFinally;