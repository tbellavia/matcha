import Button from "../../../../components/ui/button/Button";
import styles from "../../Profile.module.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useContext } from "react";
import AppContext from "../../../../store/AppContext";

function ButtonGroupMe() {
    const navigate = useNavigate()
    const ctx = useContext(AppContext);

    const onModifClicked = () => {
        // TODO: Manage error

        navigate("/profile/edit");

    }


    const onDelProfilClicked = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/user/me`, {
                headers: {
                    Authorization: `Bearer ${ctx.token}`, 
                },
                data: {
                }
            });
            ctx.logout()
        } catch (e) {}
    }

    return (
        <React.Fragment>
            <Button
                type="submit"
                variant="regular"
                className={styles["button"]}
                onClick={onModifClicked}>

                modifier
            </Button>
            <Button
                type="submit"
                variant="action-danger"
                className={styles["button"]}
                onClick={onDelProfilClicked}>
                supprimer mon profil
            </Button>
        </React.Fragment>
    )
}

export default ButtonGroupMe;