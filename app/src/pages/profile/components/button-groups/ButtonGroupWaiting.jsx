import React from "react";
import Button from "../../../../components/ui/button/Button";
import styles from "../../Profile.module.scss";
import useFetch from "../../../../hooks/use-fetch";
import {useNavigate} from "react-router-dom";

function ButtonGroupWaiting({profileID, liked}) {
	const fetcher = useFetch()
	const navigate = useNavigate()

	async function onMatchDelete() {
		try {
			await fetcher(`/api/user/unlike/me/${profileID}`, "POST");
			navigate("/feed");
		} catch (e) {
			navigate("/feed");
		}
    }

	const onReportClicked = async () => {
		try {
			await fetcher(`/api/user/blocked/me/report/${profileID}`, "POST");
			await fetcher(`/api/user/blocked/me/${profileID}`, "POST");
			navigate("/feed");
		} catch (e) {
		}
	}

	return (
		<React.Fragment>
			{ liked &&
			<Button
                type="submit"
                variant="regular"
                className={styles["button"]}
                onClick={onMatchDelete}
            >
                Annuler
            </Button>
			}
			<Button
				type="submit"
				variant="action-danger"
				className={styles["button"]}
				onClick={onReportClicked}
			>
				Signaler
			</Button>
		</React.Fragment>
	);
}

export default ButtonGroupWaiting;