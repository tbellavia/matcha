import React from "react";
import Button from "../../../../components/ui/button/Button";
import styles from "../../Profile.module.scss";
import useFetch from "../../../../hooks/use-fetch";
import {useNavigate} from "react-router-dom";

function ButtonGroupFinally({profileID}) {
    const fetcher = useFetch()
    const navigate = useNavigate()

    const onNopClicked = async () => {
        try {
            await fetcher(`/api/user/unlike/me/${profileID}`, "POST");
            navigate("/feed");
        } catch (e) {
        }
    }

    const onReportClicked = async () => {
        try {
            fetcher(`/api/user/blocked/me/report/${profileID}`, "POST");
            await fetcher(`/api/user/blocked/me/${profileID}`, "POST");
            navigate("/feed");
        } catch (e) {
        }
    }
    
    const onOkayClicked = async () => {
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
                nope
            </Button>
            <Button
                type="submit"
                variant="action-danger"
                className={styles["button"]}
                onClick={onReportClicked}
            >
                Signaler
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