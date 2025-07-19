import React from "react";
import Button from "../../../../components/ui/button/Button";
import styles from "../../Profile.module.scss";
import useFetch from "../../../../hooks/use-fetch";
import {useNavigate, useParams} from "react-router-dom";

function ButtonGroupMatch() {
    const { id } = useParams();
    const fetcher = useFetch();
    const navigate = useNavigate();

    async function onMatchDelete() {
        try {
            await fetcher(`/api/user/unlike/me/${id}`, "POST");
            navigate("/feed");
        } catch (e) {
            navigate("/feed");
        }
    }

    async function onMatchReport() {
        try {
            await fetcher(`/api/user/blocked/me/report/${id}`, "POST");
            await fetcher(`/api/user/blocked/me/${id}`, "POST");
            navigate("/feed");
        } catch (e) {
            navigate("/feed");
        }
    }

    async function onMatchBlock() {
        try {
            await fetcher(`/api/user/blocked/me/${id}`, "POST");
            navigate("/feed");
        } catch (e) {
            navigate("/feed");
        }
    }

    return (
        <React.Fragment>
            <Button
                type="submit"
                variant="regular"
                className={styles["button"]}
                onClick={onMatchDelete}
            >
                supprimer
            </Button>
            <Button
                type="submit"
                variant="action-danger"
                className={styles["button"]}
                onClick={onMatchReport}
            >
                Signaler
            </Button>
            <Button
                type="submit"
                variant="action-danger"
                className={styles["button"]}
                onClick={onMatchBlock}
            >
                bloquer
            </Button>
        </React.Fragment>
    )
}

export default ButtonGroupMatch;